import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={16} color={COLORS.textDark} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: "600",
  },
});
