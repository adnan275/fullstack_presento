import "../styles/ProductCardUser.css";

export default function ProductCardUser({
  product,
  onProductClick = () => {},
  onAddToCart = () => {},
  onViewDetails = () => {},
}) {
  const shortDescription =
    product.description?.length > 90
      ? `${product.description.slice(0, 87)}…`
      : product.description || "Pastel-perfect keepsakes for heartfelt gifting.";

  return (
    <div className="product-card-user">
      <button
        type="button"
        className="product-image-wrapper"
        onClick={() => onProductClick(product.id)}
      >
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div
          className={`product-badge ${
            product.stock > 0 ? "in-stock" : "out-of-stock"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Sold Out"}
        </div>
      </button>

      <div className="product-card-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{shortDescription}</p>
        <div className="product-meta-row">
          <span className="product-price">₹{product.price}</span>
          <span className="product-stock-label">
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </span>
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => onViewDetails(product.id)}
          >
            View Details
          </button>
          <button
            type="button"
            className="btn-solid"
            disabled={product.stock === 0}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
