import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  starClassName?: string;
  containerClassName?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  starClassName = "h-5 w-5",
  containerClassName = "",
}) => {
  const roundedRating = Math.round(rating);
  const stars = [];
  for (let i = 0; i < totalStars; i++) {
    stars.push(
      <Star
        key={i}
        className={`${starClassName} ${
          i < roundedRating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    );
  }
  return (
    <div className={`flex items-center ${containerClassName}`}>{stars}</div>
  );
};

export default StarRating;
