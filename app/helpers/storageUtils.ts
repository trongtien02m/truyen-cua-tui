import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Lưu trạng thái vào AsyncStorage
 * @param key Tên khóa
 * @param value Giá trị cần lưu
 */
export const saveState = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

/**
 * Tải trạng thái từ AsyncStorage
 * @param key Tên khóa
 * @returns Giá trị đã lưu hoặc null nếu không tồn tại
 */
export const loadState = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error loading state:", error);
    return null;
  }
};

export const checkStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log("Stored keys and values:", values);
  } catch (error) {
    console.error("Error checking AsyncStorage:", error);
  }
};
