import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { useBudgets } from "../../hooks/useBudgets";
import { useGoals } from "../../hooks/useGoals";
import { styles } from "../../assets/styles/analysis.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

const PERIODS = ["Daily", "Weekly", "Monthly", "Year"];

const getMonthLabel = (date) =>
  date.toLocaleString("en-US", { month: "short" });

const getDayLabel = (date) =>
  date.toLocaleString("en-US", { weekday: "short" });

const getWeekLabel = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return `${getMonthLabel(start)} ${start.getDate()}`;
};

const getYearLabel = (date) => date.getFullYear().toString();

const normalizeAmount = (value) => Math.max(6, Math.min(value, 140));

export default function AnalysisScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [period, setPeriod] = useState("Monthly");

  const {
    transactions,
    summary,
    isLoading,
    loadData,
    error: transactionsError,
  } = useTransactions(user?.id);
  const {
    budgets,
    isLoading: isBudgetsLoading,
    loadBudgets,
    error: budgetsError,
  } = useBudgets(user?.id);
  const { goals, isLoading: isGoalsLoading, loadGoals, error: goalsError } = useGoals(user?.id);

  useEffect(() => {
    loadData();
    loadBudgets();
    loadGoals();
  }, [loadData, loadBudgets, loadGoals]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadBudgets();
      loadGoals();
    }, [loadData, loadBudgets, loadGoals])
  );

  const { chartData, incomeTotal, expenseTotal } = useMemo(() => {
    const totals = { income: 0, expense: 0 };
    const buckets = new Map();

    (transactions || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (Number.isNaN(amount)) return;

      if (amount >= 0) totals.income += amount;
      if (amount < 0) totals.expense += Math.abs(amount);

      const date = new Date(tx.created_at);
      if (Number.isNaN(date.getTime())) return;

      let label = "";
      if (period === "Daily") label = getDayLabel(date);
      if (period === "Weekly") label = getWeekLabel(date);
      if (period === "Monthly") label = getMonthLabel(date);
      if (period === "Year") label = getYearLabel(date);
      if (!label) return;
      buckets.set(label, (buckets.get(label) || 0) + Math.abs(amount));
    });

    let defaultLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    if (period === "Daily") defaultLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (period === "Weekly") defaultLabels = Array.from(buckets.keys()).slice(0, 6);
    if (period === "Year") defaultLabels = Array.from(buckets.keys()).slice(0, 6);
    if (defaultLabels.length === 0) defaultLabels = ["N/A"];

    const chart = defaultLabels.map((label) => ({
      label,
      value: buckets.get(label) || 0,
    }));

    return {
      chartData: chart,
      incomeTotal: totals.income,
      expenseTotal: totals.expense,
    };
  }, [transactions, period]);

  const spendingByCategory = useMemo(() => {
    const totals = {};
    (transactions || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (Number.isNaN(amount) || amount >= 0) return;
      const key = tx.category || "Other";
      totals[key] = (totals[key] || 0) + Math.abs(amount);
    });
    return totals;
  }, [transactions]);

  const budgetStats = useMemo(() => {
    if (!budgets?.length) return { total: 0, overLimit: 0 };
    const over = budgets.reduce((count, budget) => {
      const spent = spendingByCategory[budget.category] || 0;
      return count + (spent > Number(budget.amount) ? 1 : 0);
    }, 0);
    return { total: budgets.length, overLimit: over };
  }, [budgets, spendingByCategory]);

  const goalStats = useMemo(() => {
    if (!goals?.length) return { total: 0, avgProgress: 0 };
    const totalProgress = goals.reduce((sum, goal) => {
      const target = Number(goal.target_amount);
      const saved = Number(goal.current_amount || 0);
      if (!target) return sum;
      return sum + Math.min(saved / target, 1);
    }, 0);
    return { total: goals.length, avgProgress: totalProgress / goals.length };
  }, [goals]);

  if (isLoading) return <PageLoader />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={transactionsError || budgetsError || goalsError} />
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Balance</Text>
              <Text style={styles.summaryValue}>${Number(summary?.balance || 0).toFixed(2)}</Text>
              <Text style={styles.summarySub}>All time</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Total Expense</Text>
              <Text style={[styles.summaryValue, { color: COLORS.expense }]}
              >
                -${Number(summary?.expenses || 0).toFixed(2)}
              </Text>
              <Text style={styles.summarySub}>All time</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Period</Text>
        <View style={styles.periodToggle}>
          {PERIODS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.periodButton, period === item && styles.periodButtonActive]}
              onPress={() => setPeriod(item)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === item && styles.periodButtonTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.textDark }]}>Income & Expenses</Text>
          <View style={styles.chartRow}>
            {chartData.map((item) => (
              <View key={item.label} style={{ alignItems: "center" }}>
                <View style={[styles.bar, { height: normalizeAmount(item.value / 40) }]} />
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Activity</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.income }]} />
              <Text style={styles.legendText}>Income ${incomeTotal.toFixed(0)}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.expense }]} />
              <Text style={styles.legendText}>Expense ${expenseTotal.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Targets snapshot</Text>
        <View style={styles.targetsSummaryCard}>
          <View style={styles.targetsSummaryRow}>
            <View style={styles.targetsSummaryItem}>
              <Text style={styles.summaryLabel}>Budgets</Text>
              <Text style={styles.summaryValue}>
                {isBudgetsLoading ? "..." : budgetStats.total}
              </Text>
              <Text style={styles.summarySub}>
                {isBudgetsLoading
                  ? "Loading"
                  : budgetStats.total
                  ? `${budgetStats.overLimit} over limit`
                  : "No budgets yet"}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.targetsSummaryItem}>
              <Text style={styles.summaryLabel}>Goals</Text>
              <Text style={styles.summaryValue}>
                {isGoalsLoading ? "..." : goalStats.total}
              </Text>
              <Text style={styles.summarySub}>
                {isGoalsLoading
                  ? "Loading"
                  : goalStats.total
                  ? `${Math.round(goalStats.avgProgress * 100)}% avg progress`
                  : "No goals yet"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My Targets</Text>
        <View style={styles.targetsContainer}>
          <Text style={styles.targetText}>Track your budgets and goals.</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.periodButton, styles.periodButtonActive]}
              onPress={() => router.push("/budgets")}
            >
              <Text style={[styles.periodButtonText, styles.periodButtonTextActive]}>
                Budgets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, styles.periodButtonActive]}
              onPress={() => router.push("/goals")}
            >
              <Text style={[styles.periodButtonText, styles.periodButtonTextActive]}>
                Goals
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
