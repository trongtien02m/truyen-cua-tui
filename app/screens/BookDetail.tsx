import { get } from '@/helpers/mmkvStoreUtils';
import { getCurrentBook, updateMyBooks } from '@/service/account';
import useAppStore from '@/store/store';
import { Book } from '@/types/Book';
import { Chapter } from '@/types/Chapter';
import { StoreValueType } from '@/types/StoreValueType';
import ChapterList from '@app/components/ChapterList';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BookDetail = () => {
  const currentBook = useAppStore((state) => state.currentBook)!;
  const chapters = useAppStore((state) => state.chapters) || [];
  const setCurrentChapter = useAppStore((state) => state.setCurrentChapter);
  const setCurrentBook = useAppStore((state) => state.setCurrentBook);

  useEffect(() => {
    setCurrentBook(getCurrentBook(currentBook.id));
  }, []);
  const onChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setCurrentBook({
      ...currentBook,
      current_reading_chapter: chapter.index,
    });
    updateMyBooks({
      ...currentBook,
      current_reading_chapter: chapter.index,
    });
    router.push('/screens/Audio');
  };

  const onRead = () => {
    const myBooks = get('myBooks', StoreValueType.Object) || [];
    const currentReadingChapter =
      myBooks.find((b: Book) => b.id === currentBook.id)
        ?.current_reading_chapter || 1;
    const chapter = chapters[currentReadingChapter - 1];
    setCurrentChapter(chapter);
    setCurrentBook({
      ...currentBook,
      current_reading_chapter: currentReadingChapter,
    });
    router.push('/screens/Audio');
  };

  const onBack = () => {
    router.push('/screens/HomeScreen');
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
            Tác giả: {currentBook.author?.name || 'Không rõ'}
          </Text>
          <TouchableOpacity style={styles.readButton} onPress={onRead}>
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
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={null}
        ListFooterComponent={
          <ChapterList
            chapters={chapters}
            currentReadingChapter={currentBook?.current_reading_chapter || 1}
            onChapterSelect={(chapter) => onChapterSelect(chapter)}
          />
        }
      />
    </View>
  );
};

export default BookDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  readButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    fontSize: 14,
    color: '#666',
  },
});
