import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";

export const useGoals = (userId) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/goals/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setGoals(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.log("Error fetching goals", error);
      setError("Unable to load goals. Check your connection.");
    }
  }, [userId]);

  const createGoal = useCallback(
    async (payload) => {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create goal");
      }
      setError(null);
      return response.json();
    },
    []
  );

  const updateGoal = useCallback(async (id, payload) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to update goal");
    }
    setError(null);
    return response.json();
  }, []);

  const deleteGoal = useCallback(async (id, user_id) => {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete goal");
    }
    setError(null);
    return response.json();
  }, []);

  const loadGoals = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await fetchGoals();
    } finally {
      setIsLoading(false);
    }
  }, [fetchGoals, userId]);

  return { goals, isLoading, loadGoals, createGoal, updateGoal, deleteGoal, error };
};
