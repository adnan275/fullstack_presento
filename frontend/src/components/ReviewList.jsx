import React from 'react';
import StarRating from './StarRating';
import './ReviewList.css';

export default function ReviewList({ reviews, currentUserId, onEdit, onDelete }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="review-list-empty">
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="review-list">
            {reviews.map((review) => (
                <div key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="review-user-info">
                            <div className="review-avatar">
                                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div className="review-user-name">{review.user?.name || 'Anonymous'}</div>
                                <div className="review-date">{formatDate(review.createdAt)}</div>
                            </div>
                        </div>
                        <div className="review-rating-display">
                            <StarRating rating={review.rating} size="small" />
                        </div>
                    </div>

                    {review.comment && (
                        <div className="review-comment">
                            {review.comment}
                        </div>
                    )}

                    {currentUserId === review.userId && (
                        <div className="review-actions">
                            <button onClick={() => onEdit(review)} className="review-action-btn">
                                Edit
                            </button>
                            <button onClick={() => onDelete(review.id)} className="review-action-btn delete">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
