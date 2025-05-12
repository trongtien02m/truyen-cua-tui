import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import VoiceSettings from "../components/VoiceSettings";
import { saveState, loadState } from "../helpers/storageUtils";
import useAppStore from "../store/store";

const Audio = () => {
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voice, setVoice] = useState("vi-vn-x-vic-local");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentBook = useAppStore((state) => state.currentBook);
  const currentChapter = useAppStore((state) => state.currentChapter);
  const chapters = useAppStore((state) => state.chapters);
  const sentences = useAppStore((state) => state.sentences);
  const setCurrentChapter = useAppStore((state) => state.setCurrentChapter);

  useEffect(() => {
    const restoreState = async () => {
      // const savedChapter = await loadState("currentChapter");
      // const savedSentenceIndex = await loadState("currentSentenceIndex");
      const savedVoice = (await loadState("voice")) || "vi-vn-x-vic-local";
      const savedPitch = (await loadState("pitch")) || 1;
      const savedRate = (await loadState("rate")) || 1.8;

      // setCurrentChapter(savedChapter);
      // setCurrentSentenceIndex(savedSentenceIndex);
      setVoice(savedVoice);
      setPitch(savedPitch);
      setRate(savedRate);

      setIsInitialized(true);
    };

    restoreState();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveState("voice", voice);
    }
  }, [voice, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveState("pitch", pitch);
    }
  }, [pitch, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveState("rate", rate);
    }
  }, [rate, isInitialized]);

  const speak = (sentenceIndex: number) => {
    if (sentenceIndex < sentences.length) {
      setCurrentSentenceIndex(sentenceIndex);
      const sentenceToSpeak = sentences[sentenceIndex];
      Speech.speak(sentenceToSpeak, {
        language: "vi-VN",
        voice: voice,
        pitch: pitch,
        rate: rate,
        onStart: () => setIsSpeaking(true),
        onDone: () => speak(sentenceIndex + 1),
        onStopped: () => setIsSpeaking(false),
      });
    } else {
      setCurrentPosition(100);
      setIsSpeaking(false);
      onNextChapter();
    }
  };

  useEffect(() => {
    if (sentences.length > 0 && isInitialized) {
      stop();
      speak(0);
    }
  }, [sentences, isInitialized]);

  useEffect(() => {
    const progress = (currentSentenceIndex / sentences.length) * 100;
    setCurrentPosition(progress);
  }, [currentSentenceIndex]);

  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const backToList = () => {
    stop();
    setCurrentChapter(null);
  };

  const onNextChapter = () => {
    if (!chapters || !currentChapter) {
      return;
    }

    setCurrentChapter(chapters[currentChapter.index]);
  };

  const onPreviousChapter = () => {
    if (!chapters || !currentChapter) {
      return;
    }

    setCurrentChapter(chapters[currentChapter.index - 2]);
  };

  if (!isInitialized || !currentChapter || !sentences.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
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
            onClose={closeModal}
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
        {/* <Image
              source={{
                uri: "https://example.com/cover.jpg", // Thay bằng URL hình ảnh bìa
              }}
              style={styles.coverImage}
            /> */}
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
          const sentenceIndex = Math.floor((value / 100) * sentences.length);
          setCurrentSentenceIndex(sentenceIndex);
          if (isSpeaking) {
            Speech.stop();
            speak(sentenceIndex);
          }
        }}
      />
      {/* Nút điều khiển */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onPreviousChapter}
          style={[
            styles.iconButton,
            // chapterIndex === 1 && styles.disabledButton,
          ]}
          // disabled={chapterData.chapter.previous?.index === undefined}
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
          onPress={() => (isSpeaking ? stop() : speak(currentSentenceIndex))}
          style={styles.iconButton}
        >
          <Icon
            name={isSpeaking ? "pause" : "play-arrow"}
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

export default Audio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  navIcons: {
    flexDirection: "row",
  },
  navIcon: {
    marginLeft: 10,
    padding: 10,
  },
  chapterInfo: {
    alignItems: "center",
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
    fontWeight: "bold",
    textAlign: "center",
  },
  storyBox: {
    flex: 1,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0", // Màu nền nhạt hơn khi bị disabled
    opacity: 0.5, // Giảm độ trong suốt để hiển thị trạng thái disabled
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  settingsButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, fontWeight: "bold" },
});
