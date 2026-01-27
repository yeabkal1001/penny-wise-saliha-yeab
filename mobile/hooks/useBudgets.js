import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";

export const useBudgets = (userId) => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/budgets/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.log("Error fetching budgets", error);
      setError("Unable to load budgets. Check your connection.");
    }
  }, [userId]);

  const createBudget = useCallback(
    async (payload) => {
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create budget");
      }
      setError(null);
      return response.json();
    },
    []
  );

  const updateBudget = useCallback(async (id, payload) => {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to update budget");
    }
    setError(null);
    return response.json();
  }, []);

  const deleteBudget = useCallback(async (id, user_id) => {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }
    setError(null);
    return response.json();
  }, []);

  const loadBudgets = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await fetchBudgets();
    } finally {
      setIsLoading(false);
    }
  }, [fetchBudgets, userId]);

  return { budgets, isLoading, loadBudgets, createBudget, updateBudget, deleteBudget, error };
};
