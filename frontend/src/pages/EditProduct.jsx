import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { updateProduct } from '../utils/api';
import '../styles/AddProductForm.css';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        price: "",
        stock: "",
        category: "Personalized",
        badge: "",
        discount: "",
        sku: "",
        isFeatured: false,
    });
    const [currentImage, setCurrentImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchProduct() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await api.get(`/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const product = res.data;
                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    shortDescription: product.shortDescription || "",
                    price: product.price || "",
                    stock: product.stock || "",
                    category: product.category || "Personalized",
                    badge: product.badge || "",
                    discount: product.discount || "",
                    sku: product.sku || "",
                    isFeatured: product.isFeatured || false,
                });
                setCurrentImage(product.imageUrl);
            } catch (err) {
                console.error('Fetch product error:', err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const generateSKU = () => {
        const lastSKU = localStorage.getItem('lastSKU') || '1000';
        const nextSKU = (parseInt(lastSKU) + 1).toString();
        localStorage.setItem('lastSKU', nextSKU);
        setFormData((prev) => ({ ...prev, sku: nextSKU }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
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
            !formData.stock
        ) {
            setError("Please fill in all required fields");
            return;
        }

        if (isNaN(formData.price) || isNaN(formData.stock)) {
            setError("Price and Stock must be valid numbers");
            return;
        }

        if (parseFloat(formData.price) < 299 || parseFloat(formData.price) > 49999) {
            setError("Price must be between ₹299 and ₹49,999");
            return;
        }

        if (parseInt(formData.stock) < 0) {
            setError("Stock must be non-negative");
            return;
        }

        if (formData.discount && (formData.discount < 0 || formData.discount > 100)) {
            setError("Discount must be between 0 and 100");
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            if (formData.shortDescription) {
                submitData.append("shortDescription", formData.shortDescription);
            }
            submitData.append("price", parseFloat(formData.price));
            submitData.append("stock", parseInt(formData.stock));
            submitData.append("category", formData.category);
            if (formData.badge) {
                submitData.append("badge", formData.badge);
            }
            if (formData.discount) {
                submitData.append("discount", parseInt(formData.discount));
            }
            if (formData.sku) {
                submitData.append("sku", formData.sku);
            }
            submitData.append("isFeatured", formData.isFeatured);

            if (newImage) {
                submitData.append("image", newImage);
            }

            const token = localStorage.getItem("token");
            await updateProduct(id, submitData);

            setSuccess("✓ Product updated successfully!");
            setTimeout(() => {
                navigate('/admin/products');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update product");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="add-product-form" style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading product...</p>
            </div>
        );
    }

    return (
        <div className="add-product-form">
            <div className="form-header">
                <Link to="/admin/products" className="btn-back-link">
                    ← Back to Products
                </Link>
                <h2>✏️ Edit Product</h2>
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
                            placeholder="e.g., Personalized Gift Hamper"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={submitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            disabled={submitting}
                        >
                            <option value="Personalized">Personalized</option>
                            <option value="Hampers">Hampers</option>
                            <option value="Gifts for Her">Gifts for Her</option>
                            <option value="Gifts for Him">Gifts for Him</option>
                            <option value="Kids Gifts">Kids Gifts</option>
                            <option value="Couple Gifts">Couple Gifts</option>
                            <option value="Romantic">Romantic</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Anniversary">Anniversary</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Festive Gifts">Festive Gifts</option>
                            <option value="Luxury Gifts">Luxury Gifts</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortDescription">Short Description (Optional)</label>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            placeholder="Brief product summary for cards (max 150 characters)..."
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            disabled={submitting}
                            rows="2"
                            maxLength="150"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            {formData.shortDescription.length}/150 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Full Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your product..."
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={submitting}
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
                                disabled={submitting}
                                step="1"
                                min="299"
                                max="49999"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="discount">Discount % (Optional)</label>
                            <input
                                id="discount"
                                type="number"
                                name="discount"
                                placeholder="0"
                                value={formData.discount}
                                onChange={handleInputChange}
                                disabled={submitting}
                                min="0"
                                max="100"
                                step="1"
                            />
                            {formData.price && formData.discount && (
                                <small style={{ color: '#2e7d32', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                    Final Price: ₹{Math.round(formData.price * (1 - formData.discount / 100))}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="stock">Stock Quantity *</label>
                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                placeholder="10"
                                value={formData.stock}
                                onChange={handleInputChange}
                                disabled={submitting}
                                min="0"
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sku">Order ID (Auto-generated)</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    id="sku"
                                    type="text"
                                    name="sku"
                                    placeholder="Auto-generated: 1001, 1002..."
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    disabled={submitting}
                                    style={{ flex: 1 }}
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={generateSKU}
                                    disabled={submitting}
                                    className="btn-generate-sku"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="badge">Tag (Optional)</label>
                            <select
                                id="badge"
                                name="badge"
                                value={formData.badge}
                                onChange={handleInputChange}
                                disabled={submitting}
                            >
                                <option value="">No Tag</option>
                                <option value="Best Seller">Best Seller</option>
                                <option value="Trending">Trending</option>
                                <option value="Popular">Popular</option>
                                <option value="Limited Edition">Limited Edition</option>
                                <option value="New Arrival">New Arrival</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="isFeatured" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input
                                    id="isFeatured"
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    disabled={submitting}
                                    style={{ width: "auto", margin: 0 }}
                                />
                                <span>Featured on Home Page</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Product Image</h3>

                    <div className="image-upload">
                        {imagePreview || currentImage ? (
                            <div className="image-preview-container">
                                <img
                                    src={imagePreview || currentImage}
                                    alt="Product"
                                    className="image-preview"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={() => {
                                            setNewImage(null);
                                            setImagePreview(null);
                                        }}
                                        disabled={submitting}
                                    >
                                        ✕ Remove New Image
                                    </button>
                                )}
                                <label htmlFor="image" className="btn-replace-image">
                                    {imagePreview ? 'Change Image' : 'Replace Image'}
                                </label>
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
                            disabled={submitting}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="btn-cancel"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "✓ Update Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
