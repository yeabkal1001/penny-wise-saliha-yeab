import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";

export default function SecurityScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account security</Text>
          <Text style={styles.rowHint}>
            Reset your password to keep your account secure.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Password</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(root)/reset-password")}
          >
            <Text style={styles.actionButtonText}>Reset password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
