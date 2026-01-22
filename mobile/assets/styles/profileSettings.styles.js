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
    marginBottom: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  readonly: {
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  rowHint: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 4,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  ghostButton: {
    backgroundColor: COLORS.cardAlt,
  },
  ghostButtonText: {
    color: COLORS.textDark,
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
  },
  dangerButtonText: {
    color: COLORS.white,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.cardAlt,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textDarkMuted,
    fontWeight: "600",
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 10,
    lineHeight: 18,
  },
});
