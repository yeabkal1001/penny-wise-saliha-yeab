import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";

export const useCategories = (userId) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      if (!userId) return;
      const response = await fetch(`${API_URL}/categories/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.log("Error fetching categories", error);
      setError("Unable to load categories. Check your connection.");
    }
  }, [userId]);

  const createCategory = useCallback(async (payload) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to create category (${response.status})`);
    setError(null);
    return response.json();
  }, []);

  const deleteCategory = useCallback(async (id, user_id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!response.ok) throw new Error("Failed to delete category");
    setError(null);
    return response.json();
  }, []);

  const loadCategories = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      await fetchCategories();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories, userId]);

  return { categories, isLoading, loadCategories, createCategory, deleteCategory, error };
};
