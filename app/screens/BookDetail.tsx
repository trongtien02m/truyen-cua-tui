import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Book } from "../types/Book"; // Import interface từ thư mục types
import { Ionicons } from "@expo/vector-icons"; // Sử dụng icon từ thư viện expo/vector-icons
import ChapterList from "../components/ChapterList"; // Import ChapterList
import { Chapter } from "../types/Chapter";

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const handleChapterPress = (chapter: Chapter) => {
    console.log("Chọn chương:", chapter.name);
    // Thực hiện hành động khi chọn chương (ví dụ: điều hướng đến nội dung chương)
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nút quay lại */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.poster.default }}
          style={styles.coverImage}
        />
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chi tiết */}
      <Text style={styles.title}>{book.name}</Text>
      <Text style={styles.author}>
        Tác giả: {book.author?.name || "Không rõ"}
      </Text>
      <TouchableOpacity style={styles.readButton}>
        <Text style={styles.readButtonText}>Đọc Truyện</Text>
      </TouchableOpacity>
      <View style={styles.statsContainer}>
        <Text style={styles.statItem}>{book.chapter_count} chương</Text>
        <Text style={styles.statItem}>{book.view_count} lượt đọc</Text>
        <Text style={styles.statItem}>{book.vote_count} đề cử</Text>
      </View>

      {/* Danh sách chương */}
      <ChapterList bookId={book.id} onChapterSelect={handleChapterPress} />
    </ScrollView>
  );
};

export default BookDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative", // Để nút quay lại nằm đè lên hình ảnh
  },
  coverImage: {
    width: "100%",
    height: 300, // Hiển thị hình ảnh dọc đầy đủ
    resizeMode: "cover", // Đảm bảo hình ảnh được hiển thị đầy đủ
  },
  backButton: {
    position: "absolute", // Nút quay lại nằm đè lên hình ảnh
    top: 20, // Cách mép trên 20px
    left: 20, // Cách mép trái 20px
    width: 40,
    height: 40,
    borderRadius: 20, // Button tròn
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  author: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  readButton: {
    backgroundColor: "#D4AF37",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  readButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    fontSize: 14,
    color: "#666",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tag: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginHorizontal: 20,
  },
});
