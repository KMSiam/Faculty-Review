import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && onRatingChange(star)}
                    className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                >
                    <Star
                        className={`w-5 h-5 ${star <= rating
                                ? 'fill-primary-500 text-primary-500'
                                : 'text-slate-600 fill-transparent'
                            }`}
                    />
                </button>
            ))}
            {!interactive && (
                <span className="ml-2 text-sm font-medium text-slate-400">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
