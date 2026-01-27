import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/notifications/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.log("Error fetching notifications", error);
      setError("Unable to load notifications. Check your connection.");
    }
  }, [userId]);

  const createNotification = useCallback(async (payload) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create notification");
    setError(null);
    return response.json();
  }, []);

  const markRead = useCallback(async (id, user_id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) throw new Error("Failed to update notification");
    setError(null);
    return response.json();
  }, []);

  const markAllRead = useCallback(async (user_id) => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) throw new Error("Failed to update notifications");
    setError(null);
    return response.json();
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await fetchNotifications();
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications, userId]);

  return {
    notifications,
    isLoading,
    loadNotifications,
    createNotification,
    markRead,
    markAllRead,
    error,
  };
};
