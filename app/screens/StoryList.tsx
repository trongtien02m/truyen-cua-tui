import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Story } from '../../src/types/Story'; // Import interface từ thư mục types
import Audio from './Audio';

const stories = [
  {
    id: 1,
    title: 'Truyền Thuyết Về Tiên Nhân',
    description: 'Một câu chuyện về hành trình tìm kiếm vị tiên nhân.',
  },
  {
    id: 2,
    title: 'Bí Mật Của Linh Sơn',
    description: 'Khám phá bí mật ẩn giấu trong ngôi đền cổ.',
  },
  {
    id: 3,
    title: 'Hành Trình Trở Thành Tiên Nhân',
    description: 'Hành trình đầy thử thách để trở thành một huyền thoại.',
  },
];

const StoryList = () => {
  const [selectedStory, setSelectedStory] = React.useState<number | null>(null);

  const handleBackToList = () => {
    setSelectedStory(null);
  };

  const renderItem = ({ item }: { item: Story }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => setSelectedStory(item.id)}
    >
      <Text style={styles.storyTitle}>{item.title}</Text>
      <Text style={styles.storyDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedStory === null ? (
        <>
          <Text style={styles.header}>Danh Sách Truyện</Text>
          <FlatList
            data={stories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      ) : (
        <Audio bookSlug="" chapter={1} onBack={handleBackToList} />
      )}
    </View>
  );
};

export default StoryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  storyItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
