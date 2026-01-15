import { useUser, useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/profile.styles";
import { COLORS } from "../../constants/colors";

const MENU_ITEMS = [
  { key: "edit", label: "Edit Profile", icon: "person" },
  { key: "security", label: "Security", icon: "lock-closed" },
  { key: "settings", label: "Settings", icon: "settings" },
  { key: "help", label: "Help", icon: "help-circle" },
];

const MENU_ROUTES = {
  edit: "/edit-profile",
  security: "/security",
  settings: "/settings",
  help: "/help",
};

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const performSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  const handleSignOut = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const shouldLogout = window.confirm("Are you sure you want to log out?");
      if (shouldLogout) performSignOut();
      return;
    }

    Alert.alert("End Session", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, End Session", style: "destructive", onPress: performSignOut },
    ]);
  };

  const displayName = user?.fullName || user?.username || "Penny Wise";
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.content, { paddingBottom: 120 }]}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={COLORS.textDark} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
              onPress={() => router.push(MENU_ROUTES[item.key])}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={18} color={COLORS.textDark} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textDarkMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
