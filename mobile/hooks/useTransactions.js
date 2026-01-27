// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

// const API_URL = "https://wallet-api-cxqp.onrender.com/api";
// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Unable to load transactions. Check your connection.");
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      setSummary(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Unable to load summary. Check your connection.");
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Unable to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      if (!userId) {
        Alert.alert("Error", "Please sign in again to continue");
        return;
      }
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction, error };
};
