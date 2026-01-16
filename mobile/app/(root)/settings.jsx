import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/profileSettings.styles";
import PageLoader from "../../components/PageLoader";
import { getStoredItem, setStoredItem } from "../../lib/storage";

const SETTINGS_KEY = "pennywise_settings";

export default function SettingsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await getStoredItem(SETTINGS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPushEnabled(Boolean(parsed.pushEnabled));
          setWeeklySummary(Boolean(parsed.weeklySummary));
          setMarketing(Boolean(parsed.marketing));
        }
      } catch (error) {
        console.log("Error loading settings", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleManagePreferences = async () => {
    setIsSaving(true);
    try {
      await setStoredItem(
        SETTINGS_KEY,
        JSON.stringify({ pushEnabled, weeklySummary, marketing })
      );
      Alert.alert("Preferences saved", "Your preferences are saved on this device.");
    } catch (error) {
      console.log("Error saving settings", error);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isSaving) return <PageLoader />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Push notifications</Text>
              <Text style={styles.rowHint}>Receive updates and alerts.</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Weekly summary</Text>
              <Text style={styles.rowHint}>Get a weekly recap of your spending.</Text>
            </View>
            <Switch value={weeklySummary} onValueChange={setWeeklySummary} />
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Product updates</Text>
              <Text style={styles.rowHint}>Hear about new features.</Text>
            </View>
            <Switch value={marketing} onValueChange={setMarketing} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Currency</Text>
              <Text style={styles.rowHint}>USD - $ (fixed)</Text>
            </View>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <View>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowHint}>English (US) (fixed)</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleManagePreferences}>
          <Text style={styles.actionButtonText}>Save preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
