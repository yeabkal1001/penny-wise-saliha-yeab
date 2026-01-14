import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useBudgets } from "../../hooks/useBudgets";
import { useGoals } from "../../hooks/useGoals";
import { useNotifications } from "../../hooks/useNotifications";
import { useEffect, useMemo, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
    error: transactionsError,
  } = useTransactions(user?.id);
  const {
    budgets,
    isLoading: isBudgetsLoading,
    loadBudgets,
    error: budgetsError,
  } = useBudgets(user?.id);
  const { goals, isLoading: isGoalsLoading, loadGoals, error: goalsError } = useGoals(user?.id);
  const {
    notifications,
    isLoading: isNotificationsLoading,
    loadNotifications,
    error: notificationsError,
  } = useNotifications(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), loadBudgets(), loadGoals(), loadNotifications()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
    loadBudgets();
    loadGoals();
    loadNotifications();
  }, [loadData, loadBudgets, loadGoals, loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item?.is_read === false).length,
    [notifications]
  );

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

  const budgetInsights = useMemo(() => {
    if (!budgets?.length) return { total: 0, overLimit: 0 };
    const over = budgets.reduce((count, budget) => {
      const spent = spendingByCategory[budget.category] || 0;
      return count + (spent > Number(budget.amount) ? 1 : 0);
    }, 0);
    return { total: budgets.length, overLimit: over };
  }, [budgets, spendingByCategory]);

  const goalInsights = useMemo(() => {
    if (!goals?.length) return { total: 0, avgProgress: 0 };
    const totalProgress = goals.reduce((sum, goal) => {
      const target = Number(goal.target_amount);
      const saved = Number(goal.current_amount || 0);
      if (!target) return sum;
      return sum + Math.min(saved / target, 1);
    }, 0);
    return { total: goals.length, avgProgress: totalProgress / goals.length };
  }, [goals]);

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (shouldDelete) deleteTransaction(id);
      return;
    }

    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Welcome,</Text>
                  <Text style={styles.usernameText} numberOfLines={1} ellipsizeMode="tail">
                    {user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                  <Ionicons name="add" size={20} color="#FFF" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/notifications")}
                >
                  <Ionicons name="notifications" size={18} color={COLORS.textDark} />
                  {!isNotificationsLoading && unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <SignOutButton />
              </View>
            </View>

            <ErrorBanner
              message={transactionsError || budgetsError || goalsError || notificationsError}
            />

            <BalanceCard summary={summary} />

            <View style={styles.insightsCard}>
              <View style={styles.insightsHeader}>
                <Text style={styles.insightsTitle}>Quick insights</Text>
                <TouchableOpacity
                  style={styles.insightsButton}
                  onPress={() => router.push("/analysis")}
                >
                  <Ionicons name="stats-chart" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsButtonText}>View</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.insightsRow}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Budgets</Text>
                  <Text style={styles.insightValue}>
                    {isBudgetsLoading ? "..." : `${budgetInsights.total}`}
                  </Text>
                  <Text style={styles.insightHint}>
                    {isBudgetsLoading
                      ? "Loading"
                      : budgetInsights.total
                      ? `${budgetInsights.overLimit} over limit`
                      : "No budgets yet"}
                  </Text>
                </View>
                <View style={styles.insightDivider} />
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Goals</Text>
                  <Text style={styles.insightValue}>
                    {isGoalsLoading ? "..." : `${goalInsights.total}`}
                  </Text>
                  <Text style={styles.insightHint}>
                    {isGoalsLoading
                      ? "Loading"
                      : goalInsights.total
                      ? `${Math.round(goalInsights.avgProgress * 100)}% avg progress`
                      : "No goals yet"}
                  </Text>
                </View>
              </View>
              <View style={styles.insightsActions}>
                <TouchableOpacity
                  style={styles.insightsChip}
                  onPress={() => router.push("/budgets")}
                >
                  <Ionicons name="wallet" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsChipText}>Budgets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.insightsChip}
                  onPress={() => router.push("/goals")}
                >
                  <Ionicons name="trophy" size={14} color={COLORS.textDark} />
                  <Text style={styles.insightsChipText}>Goals</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.transactionsHeaderContainer}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
