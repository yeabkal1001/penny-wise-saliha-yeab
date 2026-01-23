import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  backButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  content: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  goalChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.cardAlt,
    marginBottom: 8,
  },
  goalChipActive: {
    backgroundColor: COLORS.primary,
  },
  goalChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  goalChipTextActive: {
    color: COLORS.white,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
