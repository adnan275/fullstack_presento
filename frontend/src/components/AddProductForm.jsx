import React, { useState } from "react";
import api from "../utils/api";
import "../styles/AddProductForm.css";

export default function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.stock ||
      !image
    ) {
      setError("Please fill in all fields and select an image");
      return;
    }

    if (isNaN(formData.price) || isNaN(formData.stock)) {
      setError("Price and Stock must be valid numbers");
      return;
    }

    if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
      setError("Price must be positive and Stock must be non-negative");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("stock", parseInt(formData.stock));
      submitData.append("category", formData.category);
      submitData.append("image", image);

      const token = localStorage.getItem("token");
      const res = await api.post("/products", submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("✓ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "Electronics",
      });
      setImage(null);
      setImagePreview(null);

      if (onProductAdded) {
        onProductAdded(res.data);
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      <div className="form-header">
        <h2>➕ Add New Product</h2>
      </div>

      {error && <div className="message-error">{error}</div>}
      {success && <div className="message-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Product Information</h3>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g., iPhone 15 Pro"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Stationary</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="9999"
                value={formData.price}
                onChange={handleInputChange}
                disabled={loading}
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                id="stock"
                type="number"
                name="stock"
                placeholder="10"
                value={formData.stock}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Image</h3>

          <div className="image-upload">
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  disabled={loading}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label htmlFor="image" className="image-upload-label">
                <div className="upload-icon">📸</div>
                <p>Click to upload product image</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </label>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "✓ Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
