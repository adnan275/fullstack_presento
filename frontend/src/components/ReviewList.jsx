import React, { useState } from 'react';
import StarRating from './StarRating';
import MediaLightbox from './MediaLightbox';
import './ReviewList.css';

export default function ReviewList({ reviews, currentUserId, onEdit, onDelete }) {
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const openLightbox = (photos, video, startIndex = 0) => {
        const media = [];

        if (photos && photos.length > 0) {
            photos.forEach(url => {
                media.push({ type: 'photo', url });
            });
        }

        if (video) {
            media.push({ type: 'video', url: video });
        }

        setLightboxMedia(media);
        setLightboxIndex(startIndex);
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="review-list-empty">
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    const sortedReviews = [...reviews].sort((a, b) => {
        if (a.userId === currentUserId) return -1;
        if (b.userId === currentUserId) return 1;
        return 0;
    });

    return (
        <>
            <div className="review-list">
                {sortedReviews.map((review) => {
                    const isCurrentUser = currentUserId === review.userId;
                    const hasMedia = (review.photos && review.photos.length > 0) || review.video;

                    return (
                        <div key={review.id} className={`review-item ${isCurrentUser ? 'current-user-review' : ''}`}>
                            {isCurrentUser && (
                                <div className="your-review-badge">Your Review</div>
                            )}

                            <div className="review-header">
                                <div className="review-user-info">
                                    <div className="review-avatar">
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="review-user-name">
                                            {review.user?.name || 'Anonymous'}
                                            <span className="verified-purchase-badge">✓ Verified Purchase</span>
                                        </div>
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

                            {hasMedia && (
                                <div className="review-media">
                                    {review.photos && review.photos.length > 0 && (
                                        <div className="review-photos">
                                            {review.photos.slice(0, 4).map((photo, index) => (
                                                <div
                                                    key={index}
                                                    className="review-photo-thumbnail"
                                                    onClick={() => openLightbox(review.photos, review.video, index)}
                                                >
                                                    <img src={photo} alt={`Review photo ${index + 1}`} />
                                                </div>
                                            ))}
                                            {review.photos.length > 4 && (
                                                <div
                                                    className="review-photo-thumbnail more-photos"
                                                    onClick={() => openLightbox(review.photos, review.video, 4)}
                                                >
                                                    <span>+{review.photos.length - 4}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {review.video && (
                                        <div
                                            className="review-video-thumbnail"
                                            onClick={() => {
                                                const videoIndex = review.photos ? review.photos.length : 0;
                                                openLightbox(review.photos, review.video, videoIndex);
                                            }}
                                        >
                                            <video src={review.video} />
                                            <div className="video-play-overlay">
                                                <span>▶</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isCurrentUser && (
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
                    );
                })}
            </div>

            {lightboxMedia && (
                <MediaLightbox
                    media={lightboxMedia}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxMedia(null)}
                />
            )}
        </>
    );
}
