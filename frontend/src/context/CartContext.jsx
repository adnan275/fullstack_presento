import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("presento-cart");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.warn("Failed to parse cart from storage", err);
      return [];
    }
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("presento-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || item.quantity + quantity), selected: true }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock || quantity),
          selected: true,
        },
      ];
    });
    setToast(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, nextQuantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
            ...item,
            quantity: Math.max(1, Math.min(nextQuantity, item.stock || nextQuantity)),
          }
          : item
      )
    );
  };

  const toggleItemSelection = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const removeSelectedItems = () => {
    setItems((prev) => prev.filter((item) => !item.selected));
  };

  const { cartCount, cartTotal, selectedItems } = useMemo(() => {
    
    const normalizedItems = items.map(item => ({
      ...item,
      selected: item.selected !== undefined ? item.selected : true
    }));

    const selected = normalizedItems.filter((item) => item.selected);
    const count = selected.reduce((sum, item) => sum + item.quantity, 0);
    const total = selected.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return { cartCount: count, cartTotal: total, selectedItems: selected };
  }, [items]);

  const value = {
    items: items.map(item => ({ ...item, selected: item.selected !== undefined ? item.selected : true })),
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    clearCart,
    removeSelectedItems,
    cartCount,
    cartTotal,
    selectedItems,
    toast,
    dismissToast: () => setToast(""),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

