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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
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
  balanceCard: {
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
  balanceLabel: {
    fontSize: 14,
    color: COLORS.textDarkMuted,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  toggleButtonTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
});
