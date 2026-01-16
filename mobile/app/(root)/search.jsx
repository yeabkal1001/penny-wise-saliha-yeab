import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect, useRouter } from "expo-router";
import { Alert, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { styles } from "../../assets/styles/search.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";
import { useCategories } from "../../hooks/useCategories";

const TYPE_FILTERS = [
  { key: "all", label: "All" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
];

export default function SearchScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const { transactions, isLoading, loadData, deleteTransaction, error } = useTransactions(
    user?.id
  );
  const {
    categories,
    isLoading: isCatLoading,
    loadCategories,
    error: categoriesError,
  } = useCategories(user?.id);

  useEffect(() => {
    loadData();
    loadCategories();
  }, [loadData, loadCategories]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadCategories();
    }, [loadData, loadCategories])
  );

  const categoryOptions = categories;

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (transactions || []).filter((tx) => {
      const amount = Number(tx.amount);
      if (type === "income" && amount <= 0) return false;
      if (type === "expense" && amount >= 0) return false;
      if (category !== "all" && tx.category !== category) return false;
      if (!search) return true;
      return (
        String(tx.title || "").toLowerCase().includes(search) ||
        String(tx.category || "").toLowerCase().includes(search)
      );
    });
  }, [transactions, query, type, category]);

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

  if (isLoading || isCatLoading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={error || categoriesError} />
        <View style={styles.searchCard}>
          <View style={styles.inputRow}>
            <Ionicons name="search" size={16} color={COLORS.textDarkMuted} />
            <TextInput
              style={styles.input}
              placeholder="Search transactions"
              placeholderTextColor={COLORS.textDarkMuted}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.filterRow}>
            {TYPE_FILTERS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterChip, type === item.key && styles.filterChipActive]}
                onPress={() => setType(item.key)}
              >
                <Text
                  style={[styles.filterChipText, type === item.key && styles.filterChipTextActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, category === "all" && styles.filterChipActive]}
              onPress={() => setCategory("all")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  category === "all" && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categoryOptions.filter((cat) => cat.name !== "Income").map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, category === cat.name && styles.filterChipActive]}
                onPress={() => setCategory(cat.name)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    category === cat.name && styles.filterChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
            {categoryOptions.length === 0 && (
              <Text style={styles.emptyCategoryHint}>No categories yet.</Text>
            )}
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
