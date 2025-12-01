import React, { useState } from 'react';
import StarRating from './StarRating';
import './ReviewModal.css';

export default function ReviewModal({ productId, productName, existingReview, onClose, onSubmit }) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await onSubmit({ productId, rating, comment });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="review-modal-header">
                    <h2>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h2>
                    <button className="review-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="review-modal-product">
                    <p>{productName}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="review-modal-rating">
                        <label>Your Rating</label>
                        <StarRating
                            rating={rating}
                            size="xlarge"
                            interactive={true}
                            onRatingChange={setRating}
                        />
                        {rating > 0 && (
                            <span className="rating-text">
                                {rating === 1 && '⭐ Poor'}
                                {rating === 2 && '⭐⭐ Fair'}
                                {rating === 3 && '⭐⭐⭐ Good'}
                                {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                                {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                            </span>
                        )}
                    </div>

                    <div className="review-modal-comment">
                        <label>Your Review (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={5}
                            maxLength={1000}
                        />
                        <span className="char-count">{comment.length}/1000</span>
                    </div>

                    {error && <div className="review-modal-error">{error}</div>}

                    <div className="review-modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
