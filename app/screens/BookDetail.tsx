import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import useAppStore from "../store/store";
import { Book } from "../types/Book";
import { Ionicons } from "@expo/vector-icons";
import ChapterList from "../components/ChapterList";
import Audio from "./Audio";
import { Chapter } from "../types/Chapter";

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const currentBook = useAppStore((state) => state.currentBook);
  const chapters = useAppStore((state) => state.chapters) || [];
  const currentChapter = useAppStore((state) => state.currentChapter);
  const setCurrentChapter = useAppStore((state) => state.setCurrentChapter);

  const onChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
  };

  const renderHeader = () => (
    <View>
      {currentBook && (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentBook.poster.default }}
              style={styles.coverImage}
            />
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Nội dung chi tiết */}
          <Text style={styles.title}>{currentBook.name}</Text>
          <Text style={styles.author}>
            Tác giả: {currentBook.author?.name || "Không rõ"}
          </Text>
          <TouchableOpacity style={styles.readButton}>
            <Text style={styles.readButtonText}>Đọc Truyện</Text>
          </TouchableOpacity>
          <View style={styles.statsContainer}>
            <Text style={styles.statItem}>
              {currentBook.chapter_count} chương
            </Text>
            <Text style={styles.statItem}>
              {currentBook.view_count} lượt đọc
            </Text>
            <Text style={styles.statItem}>{currentBook.vote_count} đề cử</Text>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {currentBook !== null && currentChapter !== null ? (
        <Audio />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={[]}
          renderItem={null}
          ListFooterComponent={
            <ChapterList
              chapters={chapters}
              onChapterSelect={(chapter) => onChapterSelect(chapter)}
            />
          }
        />
      )}
    </View>
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
