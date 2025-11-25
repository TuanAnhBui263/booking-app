import React from 'react';
import { Star } from 'lucide-react';

const ratingScale = [1, 2, 3, 4, 5];

/**
 * Displays star rating. Can be interactive when onChange is provided.
 */
const ReviewStars = ({
  value = 0,
  size = 18,
  className = '',
  interactive = false,
  onChange,
}) => {
  const handleSelect = (rating) => {
    if (!interactive || !onChange) return;
    onChange(rating);
  };

  return (
    <div className={`flex items-center gap-1 ${interactive ? 'cursor-pointer' : ''} ${className}`}>
      {ratingScale.map((rating) => {
        const filled = rating <= value;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleSelect(rating)}
            className={interactive ? 'focus:outline-none' : 'pointer-events-none'}
            aria-label={`Rate ${rating} star${rating > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={`${filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ReviewStars;

