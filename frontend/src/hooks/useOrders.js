import { useState, useCallback } from "react";
import api from "../utils/api";

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserOrders = useCallback(async (userId) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch orders";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch order";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (userId, items, options = {}) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/orders",
        {
          userId,
          items,
          customerDetails: options.customerDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create order";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status, message) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(
        `/orders/${orderId}`,
        { status, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update order";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchUserOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
  };
}
