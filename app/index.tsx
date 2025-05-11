import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import StoryList from "./screens/StoryList";
import Explore from "./screens/Explore"; // Component mới cho tab "Khám phá"

const App = () => {
  const [activeTab, setActiveTab] = useState("MyStories"); // Quản lý tab hiện tại

  const renderContent = () => {
    if (activeTab === "MyStories") {
      return <StoryList />;
    } else if (activeTab === "Explore") {
      return <Explore />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Nội dung chính */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "MyStories" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("MyStories")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "MyStories" && styles.activeTabText,
            ]}
          >
            Truyện của tôi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === "Explore" && styles.activeTab]}
          onPress={() => setActiveTab("Explore")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Explore" && styles.activeTabText,
            ]}
          >
            Khám phá
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Bóng đổ cho Android
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 2, // Thêm viền
    borderColor: "#ccc", // Màu viền mặc định
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTab: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF", // Màu viền cho tab đang chọn
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // Bóng đổ cho Android
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
