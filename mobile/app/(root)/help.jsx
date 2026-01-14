import { useRouter } from "expo-router";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";

const FAQS = [
  {
    question: "How do I add a transaction?",
    answer: "Use the + tab to add income or expense transactions.",
  },
  {
    question: "Where do I manage budgets?",
    answer: "Open the Budgets tab to create and track spending limits.",
  },
  {
    question: "How do notifications work?",
    answer: "Enable app notifications in Settings to receive alerts.",
  },
];

export default function HelpScreen() {
  const router = useRouter();

  const handleContact = async () => {
    const email = "support@pennywise.app";
    const url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("Contact support", "Please email support@pennywise.app");
      return;
    }
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick answers</Text>
          {FAQS.map((item, index) => (
            <View key={item.question} style={[styles.row, index === FAQS.length - 1 && styles.rowLast]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.question}</Text>
                <Text style={styles.rowHint}>{item.answer}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Need more help?</Text>
          <Text style={styles.footerNote}>
            Our team typically responds within 24 hours on business days.
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleContact}>
            <Text style={styles.actionButtonText}>Contact support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
