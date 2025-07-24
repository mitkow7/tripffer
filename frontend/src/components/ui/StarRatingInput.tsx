import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  totalStars?: number;
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  totalStars = 5,
  rating,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 cursor-pointer ${
                ratingValue <= (hoverRating || rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
