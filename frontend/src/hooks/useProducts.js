import { useState, useCallback } from "react";
import api from "../utils/api";

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch products";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (productId) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/products`);
      const product = res.data.find(p => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch product";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProducts,
    fetchProductById,
  };
}
