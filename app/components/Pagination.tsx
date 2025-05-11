import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>
          {"<"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.pageInfo}>
        {currentPage} / {totalPages}
      </Text>
      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabled,
          ]}
        >
          {">"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <Text
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabled,
          ]}
        >
          {">>|"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pageButton: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#007BFF",
  },
  disabled: {
    color: "#ccc",
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Pagination;
