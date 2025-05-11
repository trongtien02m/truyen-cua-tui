import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Book } from "../types/Book"; // Import interface từ thư mục types
import Pagination from "../components/Pagination"; // Import Pagination component
import BookDetail from "./BookDetail"; // Import trang chi tiết truyện

const Explore = () => {
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [results, setResults] = useState<Book[]>([]); // Kết quả tìm kiếm
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Giá trị debounce
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Truyện được chọn

  // Xử lý debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Tìm kiếm khi `debouncedQuery` thay đổi
  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url = `https://backend.metruyencv.com/api/books/search?keyword=${encodeURIComponent(
          debouncedQuery
        )}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data.data || []);
        setTotalPages(data.pagination.last); // Cập nhật tổng số trang
      } catch {
        setError("Có lỗi xảy ra khi tìm kiếm.");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedQuery, page]);

  // Nếu có truyện được chọn, hiển thị trang chi tiết
  if (selectedBook) {
    return (
      <BookDetail
        book={selectedBook}
        onBack={() => setSelectedBook(null)} // Quay lại danh sách
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm truyện..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => setSelectedBook(item)} // Chọn truyện
          >
            <Image
              source={{ uri: item.poster.default }}
              style={styles.resultImage}
            />
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text
                style={styles.resultDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.synopsis}
              </Text>
              <Text style={styles.resultAuthor}>
                Tác giả: {item.author?.name || "Không rõ"}
              </Text>
              <Text>
                {item.chapter_count} chương - {item.view_count} lượt đọc
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {totalPages && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPage(newPage)} // Cập nhật trang
        />
      )}
      {/* Hiển thị lớp phủ loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
  },
  resultImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  resultAuthor: {
    fontSize: 14,
    color: "#007BFF",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Lớp phủ toàn màn hình
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Màu nền mờ
    zIndex: 10, // Đảm bảo lớp phủ nằm trên cùng
  },
});
