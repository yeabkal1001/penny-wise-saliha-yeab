import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { styles } from "../../assets/styles/categories.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

export default function CategoriesScreen() {
  const { user } = useUser();
  const router = useRouter();

  const { transactions, summary, isLoading: isTxLoading, loadData } = useTransactions(user?.id);
  const {
    categories,
    isLoading: isCatLoading,
    loadCategories,
    createCategory,
    deleteCategory,
    error,
  } = useCategories(user?.id);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("pricetag");
  const [newColor, setNewColor] = useState(COLORS.primary);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ICON_OPTIONS = ["pricetag", "cart", "cafe", "car", "heart", "home", "gift", "school"]; 
  const COLOR_OPTIONS = [COLORS.primary, "#2ECC71", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6"];

  useEffect(() => {
    loadData();
    loadCategories();
  }, [loadData, loadCategories]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    (transactions || []).forEach((tx) => {
      const amount = Math.abs(Number(tx.amount));
      if (Number.isNaN(amount)) return;
      const key = tx.category || "Other";
      totals[key] = (totals[key] || 0) + amount;
    });
    return totals;
  }, [transactions]);

  const isLoading = isTxLoading || isCatLoading || isSubmitting;

  const handleCreateCategory = async () => {
    if (!user?.id || !newName.trim()) return;
    setIsSubmitting(true);
    try {
      await createCategory({
        user_id: user.id,
        name: newName.trim(),
        icon: newIcon,
        color: newColor,
      });
      setNewName("");
      setNewIcon("pricetag");
      setNewColor(COLORS.primary);
      await loadCategories();
    } catch (error) {
      if (error?.message?.includes("409")) {
        Alert.alert("Duplicate category", "That category already exists.");
      } else {
        console.log("Error creating category", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (!user?.id) return;

    const performDelete = async () => {
      setIsSubmitting(true);
      try {
        await deleteCategory(categoryId, user.id);
        await loadCategories();
      } catch (error) {
        console.log("Error deleting category", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this category?");
      if (confirmed) performDelete();
      return;
    }

    Alert.alert("Delete category", "Are you sure you want to delete this category?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: performDelete },
    ]);
  };

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
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={error} />
        <View style={styles.addCard}>
          <Text style={styles.sectionTitle}>Create category</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Category name"
            placeholderTextColor={COLORS.textDarkMuted}
          />
          <Text style={styles.subLabel}>Icon</Text>
          <View style={styles.iconRow}>
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[styles.iconChip, newIcon === icon && styles.iconChipActive]}
                onPress={() => setNewIcon(icon)}
              >
                <Ionicons name={icon} size={16} color={COLORS.textDark} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.subLabel}>Color</Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color }, newColor === color && styles.colorSwatchActive]}
                onPress={() => setNewColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.addButton, !newName.trim() && styles.addButtonDisabled]}
            onPress={handleCreateCategory}
            disabled={!newName.trim()}
          >
            <Text style={styles.addButtonText}>Add category</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View>
              <Text style={styles.overviewLabel}>Total Balance</Text>
              <Text style={styles.overviewValue}>${Number(summary?.balance || 0).toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.overviewLabel}>Total Expense</Text>
              <Text style={[styles.overviewValue, { color: COLORS.expense }]}
              >
                -${Number(summary?.expenses || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categories.length === 0 && (
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>No categories yet</Text>
            <Text style={styles.overviewLabel}>Create a category above to start organizing.</Text>
          </View>
        )}
        <View style={styles.grid}>
          {categories.map((category) => {
            const total = categoryTotals[category.name] || 0;
            return (
              <View
                key={category.id}
                style={[
                  styles.categoryCard,
                  category.color && { borderColor: category.color },
                ]}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon} size={18} color={COLORS.textDark} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {categories.length > 0 && category.id && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCategory(category.id)}
                    >
                      <Ionicons name="trash" size={16} color={COLORS.textDarkMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.categoryAmount}>${total.toFixed(2)}</Text>
                <Text style={styles.categoryHint}>Tracked</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
