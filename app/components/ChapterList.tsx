import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Chapter } from "../types/Chapter";

interface ChapterListProps {
  chapters: Chapter[];
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  onChapterSelect,
}) => {
  // Tối ưu hóa renderItem bằng cách sử dụng React.memo
  const renderItem = useCallback(
    ({ item }: { item: Chapter }) => (
      <TouchableOpacity
        style={styles.chapterItem}
        onPress={() => onChapterSelect(item)}
      >
        <Text style={styles.chapterTitle}>{item.name}</Text>
        <Text style={styles.chapterDate}>
          {new Date(item.published_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    ),
    [onChapterSelect]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách chương</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem} // Sử dụng renderItem đã tối ưu hóa
        initialNumToRender={10} // Giới hạn số lượng item render ban đầu
        maxToRenderPerBatch={10} // Giới hạn số lượng item render mỗi lần
        windowSize={5} // Tăng hiệu suất bằng cách điều chỉnh windowSize
      />
    </View>
  );
};

export default ChapterList;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chapterItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  chapterDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
