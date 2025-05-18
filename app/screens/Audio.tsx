import ChapterEvent from '@/events/ChapterEvent';
import { loadState } from '@/helpers/storageUtils';
import { updateMyBooks } from '@/service/account';
import { speak, stop } from '@/service/audio';
import { fetchChapterContent } from '@/service/book';
import useAppStore from '@/store/store';
import VoiceSettings from '@app/components/VoiceSettings';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Audio = () => {
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voice, setVoice] = useState('vi-vn-x-vic-local');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  const [taskStarted, setTaskStarted] = useState(false);
  const [isListenerAdded, setIsListenerAdded] = useState(false);

  const currentBook = useAppStore((state) => state.currentBook)!;
  const currentChapter = useAppStore((state) => state.currentChapter)!;
  const chapters = useAppStore((state) => state.chapters)!;
  const sentences = useAppStore((state) => state.sentences);
  const setSentences = useAppStore((state) => state.setSentences);
  const setCurrentChapter = useAppStore((state) => state.setCurrentChapter);

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  // Handler giữ nguyên tham chiếu để removeListener hoạt động
  const chapterChangeHandler = useCallback(async (chapterIndex: number) => {
    if (chapterIndex > currentBook.chapter_count) return;

    const chapterInfo = chapters.find((c) => c.index === chapterIndex);

    if (!chapterInfo) return;

    setCurrentChapter(chapterInfo);

    updateMyBooks({
      ...currentBook,
      current_reading_chapter: chapterInfo.index,
    });

    const chapterContent = await fetchChapterContent(
      currentBook.slug,
      chapterIndex
    );
    setSentences(chapterContent);
    stop();
    speak({
      sentences: chapterContent,
      index: 0,
      updateSentenceIndex,
    });
  }, []);

  const sentenceIndexChangeHandler = useCallback(
    async (sentenceIndex: number) => {
      if (!currentBook) return;

      setCurrentSentenceIndex(sentenceIndex);

      stop();
      speak({
        sentences,
        index: sentenceIndex,
        updateSentenceIndex,
      });
    },
    []
  );

  const speakTask = async () => {
    if (!taskStarted) {
      ChapterEvent.on('chapterChanged', chapterChangeHandler);
      ChapterEvent.on('sentenceIndexChanged', sentenceIndexChangeHandler);
      setIsListenerAdded(true);
    }

    while (BackgroundService.isRunning()) {
      await sleep(10000);
    }
  };

  const startBackgroundService = async () => {
    if (!taskStarted) {
      await BackgroundService.start(speakTask, {
        taskName: 'TimeLogger',
        taskTitle: 'Đang đọc sách',
        taskDesc: 'Ứng dụng đang đọc nội dung chương...',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourapp://home',
      });
      setTaskStarted(true);
    }
  };

  const updateSentenceIndex = (index: number) => {
    setCurrentSentenceIndex(index);
  };

  const removeEventListener = () => {
    ChapterEvent.removeListener('chapterChanged', chapterChangeHandler);
  };

  // ✅ INIT + START TASK
  useEffect(() => {
    const restoreState = async () => {
      const savedVoice = (await loadState('voice')) || 'vi-vn-x-vic-local';
      const savedPitch = (await loadState('pitch')) || 1;
      const savedRate = (await loadState('rate')) || 1.8;

      setVoice(savedVoice);
      setPitch(savedPitch);
      setRate(savedRate);
    };

    restoreState();
    startBackgroundService();

    return () => {
      // ✅ Cleanup listener on unmount
      stop();
      removeEventListener();
    };
  }, []);

  useEffect(() => {
    if (isListenerAdded) {
      ChapterEvent.emit('chapterChanged', currentChapter?.index);
    }
  }, [isListenerAdded]);

  useEffect(() => {
    if (!sentences.length) return;
    const progress = (currentSentenceIndex / sentences.length) * 100;
    setCurrentPosition(progress);
  }, [currentSentenceIndex]);

  const speakHandler = () => {
    speak({ sentences, index: currentSentenceIndex, updateSentenceIndex });
    setIsSpeaking(true);
  };

  const stopHandler = () => {
    stop();
    setIsSpeaking(false);
  };

  const openModal = () => setIsModalVisible(true);

  const backToList = () => {
    stop();
    setCurrentChapter(undefined);
    router.push('/screens/BookDetail');
  };

  const slidingCompleteHandle = (value: number) => {
    const newIndex = Math.floor((value / 100) * sentences.length);
    setCurrentSentenceIndex(newIndex);
    stop();
    speak({
      sentences,
      index: newIndex,
      updateSentenceIndex,
    });
    setIsSpeaking(true);
  };

  const onNextChapter = () => {
    const nextIndex = currentChapter.index + 1;
    setCurrentChapter(chapters[nextIndex]);
    ChapterEvent.emit('chapterChanged', nextIndex);
  };

  const onPreviousChapter = () => {
    const prevIndex = currentChapter.index - 1;
    setCurrentChapter(chapters[prevIndex]);
    ChapterEvent.emit('chapterChanged', prevIndex);
  };

  if (!sentences?.length || !currentChapter) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => backToList()} style={styles.navButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{currentBook?.name}</Text>
        <View style={styles.navIcons}>
          <TouchableOpacity onPress={openModal} style={styles.navIcon}>
            <Icon name="settings" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openModal} style={styles.navIcon}>
            <Icon name="help-outline" size={24} color="#000" />
          </TouchableOpacity>
          <VoiceSettings
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            pitch={pitch}
            rate={rate}
            onPitchChange={(value) => setPitch(value)}
            onRateChange={(value) => setRate(value)}
            voice={voice}
            onVoiceChange={(value) => setVoice(value)}
          />
        </View>
      </View>

      {/* Hình ảnh bìa và tiêu đề chương */}
      <View style={styles.chapterInfo}>
        <Image
          source={{
            uri: currentBook.poster.default, // Thay bằng URL hình ảnh bìa
          }}
          style={styles.coverImage}
        />
        <Text style={styles.chapterTitle}>{currentChapter?.name}</Text>
      </View>

      {/* Nội dung chương */}
      <ScrollView style={styles.storyBox}>
        <Text style={styles.storyText}>{sentences[currentSentenceIndex]}</Text>
      </ScrollView>

      {/* Thanh tiến độ */}
      <Text style={styles.label}>Tiến độ: {Math.round(currentPosition)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={(1 / sentences.length) * 100}
        value={currentPosition}
        onSlidingComplete={(value) => {
          slidingCompleteHandle(value);
        }}
      />
      {/* Nút điều khiển */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onPreviousChapter}
          style={[
            styles.iconButton,
            currentChapter.index === 1 && styles.disabledButton,
          ]}
          disabled={currentChapter.index === 1}
        >
          <Icon
            name="skip-previous"
            size={40}
            // color={
            //   chapterData.chapter.previous?.index === undefined
            //     ? "#ccc"
            //     : "#000"
            // }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (isSpeaking ? stopHandler() : speakHandler())}
          style={styles.iconButton}
        >
          <Icon
            name={isSpeaking ? 'pause' : 'play-arrow'}
            size={40}
            color="#000"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNextChapter}
          style={[
            styles.iconButton,
            // chapterData.chapter.index === chapterData.chapterCount &&
            //   styles.disabledButton,
          ]}
          // disabled={chapterData.chapter.index === chapterData.chapterCount}
        >
          <Icon
            name="skip-next"
            size={40}
            // color={
            //   chapterData.chapter.index === chapterData.chapterCount
            //     ? "#ccc"
            //     : "#000"
            // }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  navIcons: {
    flexDirection: 'row',
  },
  navIcon: {
    marginLeft: 10,
    padding: 10,
  },
  chapterInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  storyBox: {
    flex: 1,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0', // Màu nền nhạt hơn khi bị disabled
    opacity: 0.5, // Giảm độ trong suốt để hiển thị trạng thái disabled
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  settingsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, fontWeight: 'bold' },
});

export default Audio;
