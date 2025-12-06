import React, { useState, useEffect } from 'react';
import './MediaLightbox.css';

export default function MediaLightbox({ media, initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [currentIndex, media]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const currentMedia = media[currentIndex];
    const isVideo = currentMedia.type === 'video';

    return (
        <div className="media-lightbox-overlay" onClick={onClose}>
            <div className="media-lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close-btn" onClick={onClose}>
                    ×
                </button>

                {media.length > 1 && (
                    <>
                        <button className="lightbox-nav-btn lightbox-prev-btn" onClick={goToPrevious}>
                            ‹
                        </button>
                        <button className="lightbox-nav-btn lightbox-next-btn" onClick={goToNext}>
                            ›
                        </button>
                    </>
                )}

                <div className="lightbox-media-container">
                    {isVideo ? (
                        <video src={currentMedia.url} controls autoPlay className="lightbox-video" />
                    ) : (
                        <img src={currentMedia.url} alt="Review media" className="lightbox-image" />
                    )}
                </div>

                {media.length > 1 && (
                    <div className="lightbox-thumbnails">
                        {media.map((item, index) => (
                            <div
                                key={index}
                                className={`lightbox-thumbnail ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                {item.type === 'video' ? (
                                    <div className="thumbnail-video-indicator">
                                        <span>▶</span>
                                    </div>
                                ) : (
                                    <img src={item.url} alt={`Thumbnail ${index + 1}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="lightbox-counter">
                    {currentIndex + 1} / {media.length}
                </div>
            </div>
        </div>
    );
}
