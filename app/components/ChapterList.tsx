import React, { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  FlatList as RNFlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chapter } from '../../src/types/Chapter';

interface ChapterListProps {
  chapters: Chapter[];
  currentReadingChapter: number;
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  currentReadingChapter,
  onChapterSelect,
}) => {
  const flatListRef = useRef<RNFlatList>(null);

  // Cuộn đến chương hiện tại khi component mount
  useEffect(() => {
    if (flatListRef.current && currentReadingChapter >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentReadingChapter,
          animated: false,
        });
      }, 0);
    }
  }, [currentReadingChapter]);

  const renderItem = useCallback(
    ({ item }: { item: Chapter }) => {
      const isCurrent = item.index === currentReadingChapter;
      return (
        <TouchableOpacity
          style={[styles.chapterItem, isCurrent && styles.currentChapter]}
          onPress={() => onChapterSelect(item)}
        >
          <Text
            style={[
              styles.chapterTitle,
              isCurrent && styles.currentChapterTitle,
            ]}
          >
            {item.index} {item.name}
          </Text>
          <Text
            style={[styles.chapterDate, isCurrent && styles.currentChapterDate]}
          >
            {new Date(item.published_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </Text>
        </TouchableOpacity>
      );
    },
    [onChapterSelect, currentReadingChapter]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách chương</Text>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  currentChapter: {
    backgroundColor: '#D4AF37',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currentChapterTitle: {
    color: '#fff',
  },
  chapterDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  currentChapterDate: {
    color: '#fff',
  },
});
