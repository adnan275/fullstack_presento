import React from 'react';
import './StarRating.css';

export default function StarRating({ rating, maxStars = 5, size = 'medium', interactive = false, onRatingChange }) {
    const [hoverRating, setHoverRating] = React.useState(0);
    const [selectedRating, setSelectedRating] = React.useState(rating || 0);

    React.useEffect(() => {
        setSelectedRating(rating || 0);
    }, [rating]);

    const handleClick = (value) => {
        if (interactive && onRatingChange) {
            setSelectedRating(value);
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = interactive ? (hoverRating || selectedRating) : rating;

    return (
        <div className={`star-rating star-rating-${size} ${interactive ? 'star-rating-interactive' : ''}`}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayRating;
                const isPartial = !isFilled && starValue - 0.5 <= displayRating;

                return (
                    <span
                        key={index}
                        className={`star ${isFilled ? 'star-filled' : isPartial ? 'star-partial' : 'star-empty'}`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {isFilled ? '★' : isPartial ? '⯨' : '☆'}
                    </span>
                );
            })}
        </div>
    );
}
