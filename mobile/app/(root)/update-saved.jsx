import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PageLoader from "../../components/PageLoader";
import { useGoals } from "../../hooks/useGoals";
import { styles } from "../../assets/styles/updateSaved.styles";
import { COLORS } from "../../constants/colors";
import ErrorBanner from "../../components/ErrorBanner";

export default function UpdateSavedScreen() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams();
  const { user } = useUser();
  const { goals, isLoading, loadGoals, updateGoal, error } = useGoals(user?.id);
  const [selectedGoalId, setSelectedGoalId] = useState(goalId || "");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const selectedGoal = useMemo(
    () => goals.find((goal) => String(goal.id) === String(selectedGoalId)),
    [goals, selectedGoalId]
  );

  const handleSave = async () => {
    if (!user?.id || !selectedGoalId || !amount) return;
    setIsSubmitting(true);
    try {
      await updateGoal(selectedGoalId, {
        user_id: user.id,
        current_amount: Number(amount),
      });
      router.back();
    } catch (err) {
      console.log("Error updating saved amount", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) return <PageLoader />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Saved</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <ErrorBanner message={error} />
        <View style={styles.card}>
          <Text style={styles.label}>Select goal</Text>
          {goals.length === 0 && (
            <Text style={styles.label}>No goals yet. Create one first.</Text>
          )}
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalChip, String(goal.id) === String(selectedGoalId) && styles.goalChipActive]}
              onPress={() => setSelectedGoalId(goal.id)}
            >
              <Text
                style={[styles.goalChipText, String(goal.id) === String(selectedGoalId) && styles.goalChipTextActive]}
              >
                {goal.name}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 12 }]}>Saved amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder={selectedGoal ? String(selectedGoal.current_amount ?? 0) : "0"}
            placeholderTextColor={COLORS.textDarkMuted}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 12, opacity: selectedGoalId && amount ? 1 : 0.6 }]}
            onPress={handleSave}
            disabled={!selectedGoalId || !amount}
          >
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
