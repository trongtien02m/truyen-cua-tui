import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Book } from "../types/Book";
import { Ionicons } from "@expo/vector-icons";
import ChapterList from "../components/ChapterList";
import Audio from "./Audio";
import { Chapter } from "../types/Chapter";
import { ChapterData } from "../types/ChapterData";

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const [chapterData, setChapterData] = useState<ChapterData | null>(null); // Dữ liệu chương

  const onChapterSelect = (chapter: Chapter) => {
    const chapterData = {
      chapter,
      book,
      chapterCount: book.chapter_count, // Số chương của sách
    }; // Tạo dữ liệu chương với thông tin sách

    setChapterData(chapterData); // Chọn chương và hiển thị trang Audio
  };

  if (chapterData) {
    return (
      <Audio
        chapterData={chapterData}
        onBack={() => setChapterData(null)} // Quay lại trang BookDetail
      />
    );
  }

  const renderHeader = () => (
    <View>
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
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader} // Hiển thị nội dung chi tiết ở đầu danh sách
      data={[]} // Không có dữ liệu chính trong FlatList, chỉ sử dụng để hiển thị danh sách chương
      renderItem={null} // Không cần render item chính
      ListFooterComponent={
        <ChapterList
          bookId={book.id}
          onChapterSelect={(chapter) => onChapterSelect(chapter)} // Khi chọn chương, gọi hàm onChapterSelect
        />
      } // Hiển thị danh sách chương ở cuối
    />
  );
};

export default BookDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});