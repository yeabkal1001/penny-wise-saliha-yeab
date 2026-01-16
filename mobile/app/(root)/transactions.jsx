import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Platform, SectionList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { styles } from "../../assets/styles/transactions.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

const monthLabel = (date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });

export default function TransactionsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
    error,
  } = useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sections = useMemo(() => {
    const grouped = new Map();

    (transactions || [])
      .filter((tx) => {
        if (filter === "income") return Number(tx.amount) > 0;
        if (filter === "expense") return Number(tx.amount) < 0;
        return true;
      })
      .forEach((tx) => {
        const date = new Date(tx.created_at);
        const label = Number.isNaN(date.getTime()) ? "Unknown" : monthLabel(date);
        if (!grouped.has(label)) grouped.set(label, []);
        grouped.get(label).push(tx);
      });

    return Array.from(grouped.entries()).map(([title, data]) => ({ title, data }));
  }, [transactions, filter]);

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      const shouldDelete = window.confirm("Are you sure you want to delete this transaction?");
      if (shouldDelete) deleteTransaction(id);
      return;
    }

    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  if (isLoading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/search")}>
            <Ionicons name="search" size={18} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <ErrorBanner message={error} />
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${Number(summary?.balance || 0).toFixed(2)}</Text>
        </View>

        <View style={styles.toggleRow}>
          {[
            { key: "all", label: "All" },
            { key: "income", label: "Income" },
            { key: "expense", label: "Expense" },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.toggleButton, filter === item.key && styles.toggleButtonActive]}
              onPress={() => setFilter(item.key)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  filter === item.key && styles.toggleButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.content, styles.sectionHeader]}>{title}</Text>
        )}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
