import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/MaterialIcons";
import VoiceSettings from "../components/VoiceSettings";
import { saveState, loadState } from "../helpers/storageUtils";

const chapters = [
  "Chương 1: Truyền Thuyết Về Tiên Nhân. Một ngày nọ, trong một ngôi làng nhỏ, có một cậu bé tên là Lâm Phong. Cậu nghe kể về truyền thuyết của một vị tiên nhân sống trên đỉnh núi Linh Sơn. Người dân tin rằng vị tiên nhân này có thể ban phước lành và sức mạnh vô biên. Lâm Phong quyết định bắt đầu hành trình tìm kiếm vị tiên nhân. Trên đường đi, cậu gặp một ông lão bí ẩn, người đã chỉ dẫn cậu đến một con đường bí mật. Con đường dẫn đến một khu rừng đầy rẫy nguy hiểm và những sinh vật kỳ lạ. Lâm Phong phải vượt qua một con sông lớn với dòng nước chảy xiết. Sau nhiều ngày gian khổ, cậu cuối cùng cũng đến được chân núi Linh Sơn. Nhưng để lên đỉnh núi, cậu phải vượt qua một cánh cổng được bảo vệ bởi một con rồng khổng lồ. Lâm Phong không hề nao núng, cậu quyết tâm đối mặt với thử thách. Cuối cùng, cậu đã chiến thắng con rồng và bước qua cánh cổng, tiến gần hơn đến vị tiên nhân.",
  "Chương 2: Bí Mật Của Linh Sơn. Khi bước qua cánh cổng, Lâm Phong thấy mình đứng trước một thung lũng tuyệt đẹp. Thung lũng được bao phủ bởi những đám mây trắng và ánh sáng rực rỡ. Ở trung tâm thung lũng, có một ngôi đền cổ kính với những bức tượng thần tiên. Lâm Phong bước vào ngôi đền và phát hiện một cuốn sách cổ nằm trên bàn đá. Cuốn sách chứa đựng những bí mật về cách trở thành tiên nhân. Nhưng để hiểu được cuốn sách, cậu cần phải giải mã những ký tự cổ xưa. Trong lúc đang nghiên cứu, cậu bị tấn công bởi một nhóm yêu quái canh giữ ngôi đền. Lâm Phong sử dụng trí thông minh và lòng dũng cảm để đánh bại chúng. Sau trận chiến, cậu phát hiện một viên ngọc phát sáng nằm trong ngôi đền. Viên ngọc này chính là chìa khóa để mở ra sức mạnh tiên nhân. Nhưng cậu cũng nhận ra rằng, sức mạnh này đi kèm với trách nhiệm lớn lao. Lâm Phong quyết định tiếp tục hành trình để tìm hiểu thêm về sức mạnh này.",
  "Chương 3: Hành Trình Trở Thành Tiên Nhân. Lâm Phong rời khỏi ngôi đền và tiếp tục leo lên đỉnh núi Linh Sơn. Trên đường đi, cậu gặp một nhóm người cũng đang tìm kiếm vị tiên nhân. Họ quyết định hợp tác để vượt qua những thử thách khó khăn. Nhóm của Lâm Phong phải đối mặt với một cơn bão tuyết dữ dội trên núi. Họ tìm thấy một hang động để trú ẩn và phát hiện một bức tường khắc đầy những ký tự cổ. Những ký tự này tiết lộ rằng, chỉ những người có trái tim trong sáng mới có thể gặp được vị tiên nhân. Lâm Phong và nhóm của cậu tiếp tục hành trình với lòng quyết tâm cao độ. Cuối cùng, họ đến được đỉnh núi và thấy một ngôi nhà nhỏ nằm giữa những đám mây. Vị tiên nhân xuất hiện và chào đón họ với nụ cười hiền từ. Ông nói rằng, chỉ có Lâm Phong là người xứng đáng nhận được sức mạnh tiên nhân. Lâm Phong quỳ xuống và nhận lấy sức mạnh, hứa sẽ sử dụng nó để bảo vệ thế giới. Từ đó, cậu trở thành một huyền thoại, được người đời ca tụng là Tiên Nhân Lâm Phong.",
];

const getSentences = (text: string) => {
  return text.split(/(?<=[.!?])\s+/); // Tách câu dựa trên dấu câu
};

interface AudioProps {
  onBack: () => void;
}

const Audio: React.FC<AudioProps> = ({ onBack }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voice, setVoice] = useState("vi-vn-x-vic-local"); // Giọng đọc mặc định
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false); // Trạng thái khởi tạo

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

      setIsInitialized(true); // Đánh dấu khởi tạo hoàn tất
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
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter((prev) => prev + 1); // Tăng chương hiện tại
      setCurrentSentenceIndex(0); // Reset câu hiện tại
    } else {
      Alert.alert("Thông báo", "Đây là chương cuối cùng.");
    }
  }, [currentChapter]);

  const previousChapter = React.useCallback(() => {
    if (currentChapter > 0) {
      setCurrentChapter((prev) => prev - 1); // Giảm chương hiện tại
      setCurrentSentenceIndex(0); // Reset câu hiện tại
    } else {
      Alert.alert("Thông báo", "Đây là chương đầu tiên.");
    }
  }, [currentChapter]);

  const speak = (sentenceIndex: number) => {
    if (sentenceIndex < sentences.length) {
      setCurrentSentenceIndex(sentenceIndex); // Cập nhật câu hiện tại
      const sentenceToSpeak = sentences[sentenceIndex]; // Lấy câu hiện tại
      Speech.speak(sentenceToSpeak, {
        language: "vi-VN", // Ngôn ngữ tiếng Việt
        voice: voice, // Sử dụng giọng đọc đã chọn
        pitch: pitch, // Sử dụng tông giọng
        rate: rate, // Sử dụng tốc độ đọc
        onStart: () => setIsSpeaking(true),
        onDone: () => speak(sentenceIndex + 1), // Đọc câu tiếp theo khi hoàn thành
        onStopped: () => setIsSpeaking(false),
      });
    } else {
      console.log("next chapter");
      setCurrentPosition(100);
      setIsSpeaking(false); // Kết thúc khi đọc xong tất cả các câu
      nextChapter();
    }
  };

  const stop = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!isInitialized) return;
    const newSentences = getSentences(chapters[currentChapter]); // Cập nhật danh sách câu khi chương thay đổi
    setSentences(newSentences);
  }, [currentChapter, isInitialized]); // Thêm isInitialized vào dependency array để chạy khi khởi tạo

  useEffect(() => {
    if (!isInitialized) return; // Chỉ chạy khi đã khởi tạo
    if (sentences.length > 0) {
      stop();
      speak(currentSentenceIndex);
    }
  }, [sentences]);

  useEffect(() => {
    if (!isInitialized) return;
    if (sentences.length === 0) {
      setCurrentPosition(0);
      return;
    }
    const progress = (currentSentenceIndex / sentences.length) * 100; // Tính phần trăm tiến độ
    setCurrentPosition(progress); // Cập nhật tiến độ
  }, [currentSentenceIndex, isInitialized, sentences]); // Theo dõi sự thay đổi của câu hiện tại và tổng số câu

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const backToList = () => {
    stop();
    onBack(); // Quay lại danh sách truyện
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
      <TouchableOpacity onPress={() => backToList()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Quay lại danh sách</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openModal} style={styles.settingsButton}>
        <Icon name="settings" size={30} color="#000" />
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

      <Text style={styles.label}>Chương hiện tại: {currentChapter + 1}</Text>
      <ScrollView style={styles.storyBox}>
        <Text style={styles.storyText}>{sentences[currentSentenceIndex]}</Text>
      </ScrollView>
      <Text style={styles.label}>Tiến độ: {Math.round(currentPosition)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100} // Thanh trượt từ 0% đến 100%
        step={(1 / sentences.length) * 100} // Tăng giảm theo từng %
        value={currentPosition} // Giá trị hiện tại của thanh trượt
        onSlidingComplete={(value) => {
          const sentenceIndex = Math.floor((value / 100) * sentences.length); // Tính câu tương ứng với phần trăm
          setCurrentSentenceIndex(sentenceIndex); // Cập nhật câu hiện tại
          if (isSpeaking) {
            Speech.stop(); // Dừng đọc hiện tại
            speak(sentenceIndex); // Đọc tiếp từ câu mới
          }
        }}
      />
      <View style={styles.buttonRow}>
        {/* Nút Chương Trước */}
        <TouchableOpacity
          onPress={previousChapter}
          style={[
            styles.iconButton,
            currentChapter === 0 && styles.disabledButton, // Thêm style khi bị vô hiệu hóa
          ]}
          disabled={currentChapter === 0} // Vô hiệu hóa nếu không có chương trước
        >
          <Icon
            name="skip-previous"
            size={40}
            color={currentChapter === 0 ? "#ccc" : "#000"}
          />
        </TouchableOpacity>

        {/* Nút Đọc/Dừng */}
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

        {/* Nút Chương Sau */}
        <TouchableOpacity
          onPress={nextChapter}
          style={[
            styles.iconButton,
            currentChapter === chapters.length - 1 && styles.disabledButton, // Thêm style khi bị vô hiệu hóa
          ]}
          disabled={currentChapter === chapters.length - 1} // Vô hiệu hóa nếu không có chương sau
        >
          <Icon
            name="skip-next"
            size={40}
            color={currentChapter === chapters.length - 1 ? "#ccc" : "#000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  storyBox: { marginBottom: 20, maxHeight: 300 },
  storyText: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 16, marginVertical: 10 },
  slider: { width: "100%", height: 40 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
    backgroundColor: "#e0e0e0", // Màu nhạt hơn cho nút bị vô hiệu hóa
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
