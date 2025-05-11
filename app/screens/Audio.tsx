import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import VoiceSettings from "../components/VoiceSettings";
import { saveState, loadState } from "../helpers/storageUtils";
import decryptContent from "../helpers/decryptContent";
import { ChapterData } from "../types/ChapterData";

interface AudioProps {
  chapterData: ChapterData;
  onBack: () => void;
}

const Audio: React.FC<AudioProps> = ({ chapterData, onBack }) => {
  const [chapters, setChapters] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voice, setVoice] = useState("vi-vn-x-vic-local");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchChapperContent = async (chapter: number) => {
    try {
      const url = `https://metruyencv.com/truyen/${chapterData.book.slug}/chuong-${chapter}`;
      const response = await fetch(url);
      const html = await response.text();
      const match = html.match(/content:\s*"(.*?)"/);

      if (match && match[1]) {
        let encryptContent = match[1];
        encryptContent = encryptContent.replace(/\\\//g, "/");
        encryptContent = encryptContent.replace(/\\n/g, "\n");
        encryptContent = encryptContent.replace(/\\t/g, "\t");
        encryptContent = encryptContent.replace(/\\"/g, '"');
        encryptContent = encryptContent.replace(/\\\\/g, "\\");

        let content = decryptContent(encryptContent);
        content = content.map((item: string) => item.replace(/"/g, ""));
        setSentences(content);
      }
    } catch (err) {
      console.error("Error fetching chapter content:", err);
    }
  };

  useEffect(() => {
    fetchChapperContent(chapterData.chapter.index);
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      const savedChapter = await loadState("currentChapter");
      const savedSentenceIndex = await loadState("currentSentenceIndex");
      const savedVoice = await loadState("voice");
      const savedPitch = await loadState("pitch");
      const savedRate = await loadState("rate");

      setCurrentChapter(savedChapter);
      setCurrentSentenceIndex(savedSentenceIndex);
      setVoice(savedVoice);
      setPitch(savedPitch);
      setRate(savedRate);

      setIsInitialized(true);
    };

    restoreState();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveState("currentChapter", currentChapter);
    }
  }, [currentChapter, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveState("currentSentenceIndex", currentSentenceIndex);
    }
  }, [currentSentenceIndex, isInitialized]);

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

  const nextChapter = React.useCallback(() => {
    Alert.alert("Thông báo", "Chức năng chuyển chương chưa được triển khai.");
  }, []);

  const previousChapter = React.useCallback(() => {
    if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1);
      setCurrentSentenceIndex(0);
    } else {
      Alert.alert("Thông báo", "Đây là chương đầu tiên.");
    }
  }, [currentChapter]);

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
      nextChapter();
    }
  };

  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const backToList = () => {
    stop();
    onBack();
  };

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Thanh điều hướng */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => backToList()} style={styles.navButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{chapterData.book.name}</Text>
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
        <Image
          source={{
            uri: "https://example.com/cover.jpg", // Thay bằng URL hình ảnh bìa
          }}
          style={styles.coverImage}
        />
        <Text style={styles.chapterTitle}>
          {chapterData.chapter.name}
        </Text>
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
          onPress={previousChapter}
          style={[
            styles.iconButton,
            chapterData.chapter.index === 1 && styles.disabledButton,
          ]}
          disabled={chapterData.chapter.previous?.index === undefined}
        >
          <Icon
            name="skip-previous"
            size={40}
            color={
              chapterData.chapter.previous?.index === undefined ? "#ccc" : "#000"
            }
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
        <Text>
          {JSON.stringify(chapterData.chapter.next)}
        </Text>
        <TouchableOpacity
          onPress={nextChapter}
          style={[
            styles.iconButton,
            chapterData.chapter.index === chapterData.chapterCount && styles.disabledButton,
          ]}
          disabled={chapterData.chapter.index === chapterData.chapterCount}
        >
          <Icon
            name="skip-next"
            size={40}
            color={
              chapterData.chapter.index === chapterData.chapterCount ? "#ccc" : "#000"
            }
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
