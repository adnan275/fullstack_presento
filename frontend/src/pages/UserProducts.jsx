import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProductCardUser from "../components/ProductCardUser";
import ProductModal from "../components/ProductModal";
import OrderConfirmation from "../components/OrderConfirmation";
import ReviewModal from "../components/ReviewModal";
import { useProducts } from "../hooks/useProducts";
import { useOrders } from "../hooks/useOrders";
import { useCart } from "../context/CartContext.jsx";
import "./products.css";

export default function UserProducts({ defaultTab = "products" }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const contactLinks = [
    {
      label: "WhatsApp",
      href: "https://wa.me/918955791761",
      type: "whatsapp",
    },
    {
      label: "Phone",
      href: "tel:+918955791761",
      type: "phone",
    },
    {
      label: "Email",
      href: "mailto:adnan.ashar7869@gmail.com",
      type: "email",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/presento_treasure?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      type: "instagram",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      setActiveTab("orders");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const { fetchProducts } = useProducts();
  const { fetchUserOrders, createOrder } = useOrders();

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (defaultTab === "orders" && !user?.id) {
          navigate("/login", { state: { from: location } });
          return;
        }

        const productsData = await fetchProducts();
        setProducts(productsData);

        if (user?.id) {
          const ordersData = await fetchUserOrders(user.id);
          setOrders(ordersData);
        }
      } catch (err) {
        console.error("Load error:", err);
        setErrorMessage("Failed to load data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchProducts, fetchUserOrders, navigate, defaultTab, location]);

  const handlePlaceOrder = async (productId, quantity) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const product = products.find((p) => p.id === productId);

      if (!product) {
        setErrorMessage("Product not found");
        return;
      }

      if (product.stock < quantity) {
        setErrorMessage(
          `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`
        );
        return;
      }

      const orderData = await createOrder(user.id, [
        {
          productId,
          quantity,
          price: product.price,
        },
      ]);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, stock: p.stock - quantity }
            : p
        )
      );

      setOrders((prev) => [orderData, ...prev]);

      navigate("/orders", {
        replace: true,
        state: {
          successMessage: `Order placed successfully! Order ID: ${orderData.id}`,
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to place order. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleOpenReviewModal = (product) => {
    setReviewProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'http://localhost:4000/api/reviews',
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewProduct(null);
    } catch (err) {
      throw err;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "#1976d2";
      case "ready":
        return "#7b1fa2";
      case "out_for_delivery":
        return "#e65100";
      case "delivered":
        return "#2e7d32";
      case "pending":
        return "#f57c00";
      default:
        return "#999";
    }
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedOccasion !== "all") {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(selectedOccasion.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popular":
        filtered.sort((a, b) => {
          const aReviews = a.reviews?.length || 0;
          const bReviews = b.reviews?.length || 0;
          return bReviews - aReviews;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedOccasion("all");
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("newest");
  };

  const renderIcon = (type) => {
    switch (type) {
      case "whatsapp":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.66 15l-1.23 4.49 4.62-1.21A10 10 0 1 0 12 2zm0 18.21a8.19 8.19 0 0 1-4.17-1.15l-.3-.18-2.73.71.73-2.67-.2-.32A8.21 8.21 0 1 1 12 20.21zm4.74-5.08c-.26-.13-1.53-.76-1.77-.85s-.4-.13-.56.13-.64.85-.78 1-.29.19-.54.06a6.7 6.7 0 0 1-2-1.22 7.29 7.29 0 0 1-1.35-1.67c-.14-.26 0-.4.11-.53s.26-.32.38-.48a1.78 1.78 0 0 0 .25-.42.47.47 0 0 0 0-.45c-.07-.13-.56-1.35-.77-1.85s-.41-.42-.56-.43h-.48a.93.93 0 0 0-.66.31 2.75 2.75 0 0 0-.86 2 4.79 4.79 0 0 0 1 2.56 10.94 10.94 0 0 0 4.2 3.63 14.08 14.08 0 0 0 1.43.53 3.44 3.44 0 0 0 1.58.1 2.58 2.58 0 0 0 1.69-1.18 2.1 2.1 0 0 0 .14-1.18c-.06-.1-.23-.16-.49-.29z" />
          </svg>
        );
      case "phone":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.25 11.36 11.36 0 0 0 3.55.57 1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1A17.76 17.76 0 0 1 2 6a1 1 0 0 1 1-1h3.61a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .58 3.55 1 1 0 0 1-.25 1z" />
          </svg>
        );
      case "email":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6zm-16 12V8l8 7 8-7v10z" />
          </svg>
        );
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2zm3.5 14.5a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5zm-8-7A5.5 5.5 0 1 0 17.5 11 5.5 5.5 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zm5.75-9.75a1.25 1.25 0 1 0-1.25-1.25 1.25 1.25 0 0 0 1.25 1.25z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{activeTab === "products" ? "🛍️ Shop" : "📦 My Orders"}</h1>
            <p>{activeTab === "products" ? "Browse our curated collection" : "Track your recent purchases"}</p>
          </div>
          <div className="header-right">
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {}
      {errorMessage && (
        <div className="message-banner error-banner">
          <span>{errorMessage}</span>
          <button
            className="close-banner"
            onClick={() => setErrorMessage("")}
          >
            ✕
          </button>
        </div>
      )}

      {}
      {successMessage && (
        <div className="message-banner success-banner">
          <span>{successMessage}</span>
          <button
            className="close-banner"
            onClick={() => setSuccessMessage("")}
          >
            ✕
          </button>
        </div>
      )}

      {}
      <div className="user-tabs" style={{ display: "none" }}>
        <button
          className={`tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          🛒 All Products ({products.length})
        </button>
        <button
          className={`tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📦 My Orders ({orders.length})
        </button>
      </div>

      {}
      <div className="page-title-section" style={{ padding: "0 2rem", marginBottom: "1rem" }}>
        {activeTab === "products" ? (
          <h2>All Products ({products.length})</h2>
        ) : (
          <h2>My Orders ({orders.length})</h2>
        )}
      </div>

      {}
      {activeTab === "products" && (
        <div className="products-container">
          {}
          <div className="products-controls">
            {}
            <div className="search-bar-wrapper">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search products by name, keyword, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {}
            <div className="filter-sort-bar">
              <button
                className="btn-toggle-filters"
                onClick={() => setShowFilters(!showFilters)}
              >
                🎛️ Filters {(selectedOccasion !== "all" || priceRange.max < 10000) && <span className="filter-badge">●</span>}
              </button>

              <div className="results-info">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              </div>

              <div className="sort-dropdown">
                <label htmlFor="sort-select">Sort By:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Loved ❤️</option>
                </select>
              </div>
            </div>

            {}
            <div className={`filters-panel ${showFilters ? "active" : ""}`}>
              <div className="filters-header">
                <h3>Filters</h3>
                <button
                  className="btn-close-filters"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              <div className="filters-content">
                {}
                <div className="filter-group">
                  <label htmlFor="occasion-select">Occasion</label>
                  <select
                    id="occasion-select"
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Occasions</option>
                    <option value="birthday">Birthday 🎂</option>
                    <option value="anniversary">Anniversary 💑</option>
                    <option value="wedding">Wedding 💍</option>
                    <option value="festive">Festive 🎉</option>
                    <option value="romantic">Romantic 💝</option>
                    <option value="hamper">Hampers 🎁</option>
                    <option value="nikah">Nikah Nama 📜</option>
                  </select>
                </div>

                {}
                <div className="filter-group">
                  <label htmlFor="price-range">
                    Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                  </label>
                  <div className="price-range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })
                      }
                      className="price-input"
                      min="0"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })
                      }
                      className="price-input"
                      min="0"
                    />
                  </div>
                  <input
                    type="range"
                    id="price-range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                    }
                    className="price-slider"
                  />
                </div>

                {}
                <button className="btn-clear-filters" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>

            {}
            {showFilters && (
              <div
                className="filters-overlay"
                onClick={() => setShowFilters(false)}
              />
            )}
          </div>

          {}
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCardUser
                  key={product.id}
                  product={product}
                  onProductClick={(productId) => {
                    setSelectedProductId(productId);
                    setShowDetailsModal(true);
                  }}
                  onAddToCart={addToCart}
                  onViewDetails={(productId) => navigate(`/products/${productId}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === "orders" && (
        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="no-products">
              <p>No orders yet. Browse our products to get started!</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div
                      className="order-status"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                      }}
                    >
                      {order.status.toUpperCase().replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="items-summary">
                        {order.items.map((item) => (
                          <div key={item.id} className="item-summary">
                            <span className="item-name">
                              {item.product?.name || "Unknown Product"}
                            </span>
                            <span className="item-qty">
                              Qty: <strong>{item.quantity}</strong>
                            </span>
                            <span className="item-price">
                              ₹{item.product?.price * item.quantity || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-items">No items in this order</p>
                    )}
                  </div>

                  <div className="order-message">
                    <p>{order.message}</p>
                  </div>

                  <div className="order-timeline">
                    <div
                      className={`timeline-item ${["placed", "ready", "out_for_delivery", "delivered"].includes(
                        order.status
                      )
                        ? "completed"
                        : ""
                        }`}
                    >
                      <div className="timeline-dot">✓</div>
                      <span>Placed</span>
                    </div>
                    <div
                      className={`timeline-item ${["ready", "out_for_delivery", "delivered"].includes(
                        order.status
                      )
                        ? "completed"
                        : ""
                        }`}
                    >
                      <div className="timeline-dot">✓</div>
                      <span>Ready</span>
                    </div>
                    <div
                      className={`timeline-item ${["out_for_delivery", "delivered"].includes(
                        order.status
                      )
                        ? "completed"
                        : ""
                        }`}
                    >
                      <div className="timeline-dot">✓</div>
                      <span>Out for Delivery</span>
                    </div>
                    <div
                      className={`timeline-item ${order.status === "delivered" ? "completed" : ""
                        }`}
                    >
                      <div className="timeline-dot">✓</div>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {}
                  {order.status === "delivered" && order.items && order.items.length > 0 && (
                    <div className="order-review-section">
                      <h4>Rate Your Purchase</h4>
                      <div className="review-products">
                        {order.items.map((item) => (
                          <button
                            key={item.id}
                            className="btn-review"
                            onClick={() => handleOpenReviewModal(item.product)}
                          >
                            ⭐ Rate {item.product?.name || 'Product'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      <OrderConfirmation
        isOpen={!!orderConfirmation}
        orderId={orderConfirmation?.orderId}
        items={orderConfirmation?.items || []}
        totalPrice={orderConfirmation?.totalPrice || 0}
        onClose={() => setOrderConfirmation(null)}
      />

      {}
      <ProductModal
        isOpen={showDetailsModal}
        productId={selectedProductId}
        onClose={() => setShowDetailsModal(false)}
        onAddToCart={addToCart}
      />

      {}
      {showReviewModal && reviewProduct && (
        <ReviewModal
          productId={reviewProduct.id}
          productName={reviewProduct.name}
          onClose={() => {
            setShowReviewModal(false);
            setReviewProduct(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}

      <section className="contact-section">
        <div className="contact-wrapper">
          <div className="contact-header">
            <p className="contact-pill">Need help?</p>
            <h2>Contact Us / Connect With Us</h2>
            <p>We are just a message away for order updates, styling tips, or bulk gifting queries.</p>
          </div>
          <div className="contact-grid">
            {contactLinks.map((item) => (
              <a
                key={item.label}
                className="contact-item"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className={`contact-icon ${item.type}`}>{renderIcon(item.type)}</span>
                <div className="contact-content">
                  <span className="contact-label">{item.label}</span>
                  <span className="contact-value">{item.value}</span>
                </div>
                <span className="contact-action" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
