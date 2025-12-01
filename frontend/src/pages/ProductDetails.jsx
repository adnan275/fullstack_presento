import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import { useCart } from "../context/CartContext.jsx";
import StarRating from "../components/StarRating";
import ReviewModal from "../components/ReviewModal";
import ReviewList from "../components/ReviewList";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (token) {
      checkReviewEligibility();
    }
  }, [id, token]);

  async function fetchProduct() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/reviews/product/${id}`);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  }

  async function checkReviewEligibility() {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/reviews/can-review/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCanReview(data.canReview);
      setHasReviewed(data.hasReviewed);
      if (data.hasReviewed && data.reviewId) {
        const review = reviews.find(r => r.id === data.reviewId);
        setExistingReview(review);
      }
    } catch (err) {
      console.error("Error checking review eligibility:", err);
    }
  }

  const handleSubmitReview = async (reviewData) => {
    try {
      if (existingReview) {
        await axios.put(
          `http://localhost:4000/api/reviews/${existingReview.id}`,
          reviewData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:4000/api/reviews',
          reviewData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchReviews();
      checkReviewEligibility();
      setShowReviewModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleEditReview = (review) => {
    setExistingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
      checkReviewEligibility();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="product-details-page">Loading product…</div>;
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <p>{error || "Product not found"}</p>
        <button className="btn-ghost" onClick={() => navigate("/shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <button className="btn-ghost back-btn" onClick={() => navigate("/shop")}>
        ← Back to shop
      </button>

      <div className="product-details-card">
        <img src={product.imageUrl} alt={product.name} />
        <div className="product-details-info">
          <p className="product-details-tag">{product.category}</p>
          <h1>{product.name}</h1>

          {totalReviews > 0 && (
            <div className="product-rating-summary">
              <StarRating rating={averageRating} size="medium" />
              <span className="rating-text">
                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <p className="product-details-price">₹{product.price}</p>
          <p className="product-details-desc">{product.description}</p>
          <div className="product-details-actions">
            <button
              className="btn-primary"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate("/login", { state: { from: location } });
                } else {
                  addToCart(product);
                }
              }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
            <button className="btn-ghost" onClick={() => navigate("/cart")}>
              Go to Cart
            </button>
          </div>
          <small>Stock available: {product.stock} units</small>
        </div>
      </div>

      {}
      <div className="product-reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {canReview && (
            <button
              className="btn-secondary"
              onClick={() => setShowReviewModal(true)}
            >
              {hasReviewed ? 'Edit Your Review' : 'Write a Review'}
            </button>
          )}
        </div>

        <ReviewList
          reviews={reviews}
          currentUserId={user.id}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      </div>

      {showReviewModal && (
        <ReviewModal
          productId={parseInt(id)}
          productName={product.name}
          existingReview={existingReview}
          onClose={() => {
            setShowReviewModal(false);
            setExistingReview(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
