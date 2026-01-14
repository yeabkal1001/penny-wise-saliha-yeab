import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../assets/styles/notifications.styles";
import { COLORS } from "../../constants/colors";
import PageLoader from "../../components/PageLoader";
import { useNotifications } from "../../hooks/useNotifications";
import ErrorBanner from "../../components/ErrorBanner";


const TYPE_ICON = {
  Reminder: "notifications",
  Update: "sparkles",
  Transaction: "cash",
  Report: "stats-chart",
};

const getGroupLabel = (item) => {
  if (item?.time) return item.time;
  if (!item?.created_at) return "Recent";
  const createdDate = new Date(item.created_at);
  const today = new Date();
  const isSameDay =
    createdDate.getFullYear() === today.getFullYear() &&
    createdDate.getMonth() === today.getMonth() &&
    createdDate.getDate() === today.getDate();

  return isSameDay ? "Today" : "Earlier";
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const {
    notifications,
    isLoading,
    loadNotifications,
    markRead,
    markAllRead,
    error,
  } = useNotifications(user?.id);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const grouped = useMemo(() => {
    return notifications.reduce((acc, item) => {
      const label = getGroupLabel(item);
      acc[label] = acc[label] || [];
      acc[label].push(item);
      return acc;
    }, {});
  }, [notifications]);

  const handleMarkRead = async (id) => {
    if (!user?.id) return;
    setIsUpdating(true);
    try {
      await markRead(id, user.id);
      await loadNotifications();
    } catch (error) {
      console.log("Error marking notification read", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const unreadCount = notifications.filter((item) => item?.is_read === false).length;

  const handleMarkAllRead = async () => {
    if (!user?.id || unreadCount === 0) return;
    setIsUpdating(true);
    try {
      await markAllRead(user.id);
      await loadNotifications();
    } catch (error) {
      console.log("Error marking all notifications read", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || isUpdating) return <PageLoader />;

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={[styles.headerAction, unreadCount === 0 && styles.headerActionDisabled]}
          onPress={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <Ionicons name="checkmark-done" size={18} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <ErrorBanner message={error} />
      </View>

      {notifications.length === 0 && (
        <View style={[styles.card, { marginTop: 8 }]}> 
          <View style={styles.cardRow}>
            <View style={styles.iconBadge}>
              <Ionicons name="sparkles" size={18} color={COLORS.textDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>No notifications yet</Text>
              <Text style={styles.message}>We’ll let you know about budgets and goals here.</Text>
            </View>
          </View>
        </View>
      )}

      {notifications.length > 0 &&
        Object.entries(grouped).map(([group, items]) => (
          <View key={group}>
            <Text style={styles.sectionTitle}>{group}</Text>
            {items.map((item) => {
            const isUnread = item?.is_read === false;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={isUnread ? 0.7 : 1}
                onPress={isUnread ? () => handleMarkRead(item.id) : undefined}
                style={[styles.card, isUnread && styles.unreadCard]}
              >
                <View style={styles.cardRow}>
                  <View style={styles.iconBadge}>
                    <Ionicons
                      name={TYPE_ICON[item.type] || "notifications"}
                      size={18}
                      color={COLORS.textDark}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{item.title}</Text>
                      {isUnread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.time}>{item.type}</Text>
                  </View>
                </View>
                {isUnread && (
                  <View style={styles.actionRow}>
                    <Text style={styles.actionText}>Tap to mark as read</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
            })}
          </View>
        ))}
    </ScrollView>
  );
}
