import React from "react";
import "../styles/OrderConfirmation.css";

export default function OrderConfirmation({
  isOpen,
  orderId,
  items,
  totalPrice,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
        </div>

        <div className="confirmation-details">
          <div className="detail-item">
            <label>Order ID</label>
            <p className="order-id">{orderId}</p>
            <button
              className="btn-copy"
              onClick={() => {
                navigator.clipboard.writeText(orderId);
              }}
            >
              📋 Copy
            </button>
          </div>

          <div className="detail-item">
            <label>Items Ordered</label>
            <div className="items-list">
              {items.map((item) => (
                <div key={item.productId} className="item-row">
                  <span className="item-name">{item.productName}</span>
                  <span className="item-qty">Qty: {item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-item">
            <label>Total Price</label>
            <p className="total-price">₹{totalPrice}</p>
          </div>

          <div className="confirmation-message">
            <p>
              Your order has been confirmed! You can track your order using the
              Order ID above. Check the "My Orders" section to see the status updates.
            </p>
          </div>
        </div>

        <button className="btn-close" onClick={onClose}>
          ✓ Continue Shopping
        </button>
      </div>
    </div>
  );
}
