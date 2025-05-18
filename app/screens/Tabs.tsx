import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomeProps {
  activeTab: string;
  changeTab: (tab: string) => void;
}
const HomeLayout: React.FC<HomeProps> = ({ activeTab, changeTab }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        onPress={() => changeTab('MyBooks')}
        style={[styles.tabItem, activeTab === 'MyBooks' && styles.activeTab]}
      >
        <Text
          style={activeTab === 'MyBooks' ? styles.activeTabText : styles.tabText}
        >
          Truyện của tôi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => changeTab('Explorer')}
        style={[styles.tabItem, activeTab === 'Explorer' && styles.activeTab]}
      >
        <Text
          style={
            activeTab === 'Explorer' ? styles.activeTabText : styles.tabText
          }
        >
          Khám phá
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Bóng đổ cho Android
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 2, // Thêm viền
    borderColor: '#ccc', // Màu viền mặc định
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF', // Màu viền cho tab đang chọn
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // Bóng đổ cho Android
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
