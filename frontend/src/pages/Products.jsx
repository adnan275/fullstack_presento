import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AddProductForm from "../components/AddProductForm";
import OrderTrackingModal from "../components/OrderTrackingModal";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import "./products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { fetchProducts } = useProducts();

  useEffect(() => {

    const adminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminFlag);

    async function load() {
      try {
        const response = await fetchProducts(1, 1000);
        setProducts(response.products || response);
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowAddForm(false);
  };

  const handleProductDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleStockUpdated = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  const handleOrderClick = useCallback(async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post(
        "/orders",
        { userId: user.id, items: [{ productId, quantity }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      const response = await fetchProducts(1, 1000);
      setProducts(response.products || response);
    } catch (err) {
      alert("Failed to place order: " + (err.response?.data?.error || err.message));
    }
  }, [fetchProducts]);

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-top">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
        <div className="header-content">
          <div className="header-left">
            <h1>
              {isAdmin ? "👨‍💼 Admin Dashboard" : "✨ Products Showcase"}
            </h1>
            <p>
              {isAdmin
                ? "Manage products and track orders"
                : "Discover our latest beautiful collection"}
            </p>
          </div>
          {isAdmin && (
            <div className="header-actions">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-add-product"
              >
                {showAddForm ? "✕ Close" : "➕ Add Product"}
              </button>
              <button
                onClick={() => setShowOrderModal(true)}
                className="btn-track-orders"
              >
                📦 Track Orders
              </button>
            </div>
          )}
        </div>
      </header>

      {isAdmin && showAddForm && (
        <AddProductForm onProductAdded={handleProductAdded} />
      )}

      {isAdmin && (
        <OrderTrackingModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      <div className="products-container">
        {products.length === 0 ? (
          <div className="no-products">
            <p>
              {isAdmin
                ? "No products yet. Click 'Add Product' to get started!"
                : "No products found."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isAdmin={isAdmin}
                loading={loading}
                onOrderClick={handleOrderClick}
                onProductDeleted={handleProductDeleted}
                onStockUpdated={handleStockUpdated}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Presento Treasure. All rights reserved.</p>
      </footer>
    </div>
  );
}
