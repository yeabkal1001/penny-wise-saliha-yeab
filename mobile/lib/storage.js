import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const getStoredItem = async (key) => {
  try {
    if (Platform.OS === "web") {
      return window?.localStorage?.getItem(key) ?? null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Storage get error", error);
    return null;
  }
};

export const setStoredItem = async (key, value) => {
  try {
    if (Platform.OS === "web") {
      window?.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.log("Storage set error", error);
  }
};
