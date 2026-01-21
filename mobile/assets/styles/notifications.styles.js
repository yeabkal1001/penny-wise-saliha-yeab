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
  headerAction: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  headerActionDisabled: {
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: COLORS.textDarkMuted,
    marginTop: 6,
  },
  actionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
