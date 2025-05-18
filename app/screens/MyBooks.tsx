import { get } from '@/helpers/mmkvStoreUtils';
import useAppStore from '@/store/store';
import { Book } from '@/types/Book';
import { StoreValueType } from '@/types/StoreValueType';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);
  const setCurrentBook = useAppStore((state) => state.setCurrentBook);

  useEffect(() => {
    const books = get('myBooks', StoreValueType.Object) || [];

    setMyBooks(books);
  }, []);

  const selectBook = (item: Book) => {
    setCurrentBook(item);
    router.push('/screens/BookDetail');
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => selectBook(item)}
    >
      <Image source={{ uri: item.poster.default }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.progress}>Đã đọc {item.current_reading_chapter} / {item.chapter_count}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh Sách Truyện</Text>
      <FlatList
        data={myBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default MyBooks;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  image: {
    width: 90,
    aspectRatio: 1,
    borderRadius: 4,
    marginRight: 10,
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  progress: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
