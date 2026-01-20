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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textDarkMuted,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  summarySub: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textDarkMuted,
  },
  periodToggle: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  targetsSummaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  targetsSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  targetsSummaryItem: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 44,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 12,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    marginTop: 12,
  },
  bar: {
    width: 18,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textDarkMuted,
    textAlign: "center",
    marginTop: 6,
  },
  legendRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textDarkMuted,
  },
  targetsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  targetText: {
    color: COLORS.textDarkMuted,
    fontSize: 14,
  },
});
