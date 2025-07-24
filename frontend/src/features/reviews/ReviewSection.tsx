import React, { useState } from "react";
import { Star, ThumbsUp, MessageCircle, User, Loader2 } from "lucide-react";
import { useCurrentUser, useSubmitReview } from "../../hooks/useApi";
import { Link } from "react-router-dom";

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  hotelId: number;
}

const ReviewCard = ({ review }: { review: Review }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.user}</h4>
            <p className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < review.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-4 text-gray-600 leading-relaxed">{review.comment}</p>
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-2 text-sm ${
            isLiked ? "text-blue-600" : "text-gray-500"
          } hover:text-blue-600 transition-colors`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

const ReviewStats = ({ reviews }: { reviews: Review[] }) => {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const ratingCounts = Array(5)
    .fill(0)
    .map((_, index) => ({
      stars: 5 - index,
      count: reviews.filter((review) => review.rating === 5 - index).length,
      percentage:
        totalReviews > 0
          ? (
              (reviews.filter((review) => review.rating === 5 - index).length /
                totalReviews) *
              100
            ).toFixed(0)
          : "0",
    }));

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{averageRating}</h3>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(Number(averageRating))
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {ratingCounts.map(({ stars, count, percentage }) => (
          <div key={stars} className="flex items-center">
            <span className="text-sm text-gray-600 w-12">{stars} star</span>
            <div className="flex-1 h-2 mx-4 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-12">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WriteReview = ({ hotelId }: { hotelId: number }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: currentUser } = useCurrentUser();
  const submitReview = useSubmitReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview.mutateAsync({
        hotelId,
        rating,
        comment,
      });
      // Reset form after successful submission
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return currentUser ? (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              disabled={submitReview.isPending}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          disabled={submitReview.isPending}
        />
      </div>
      <button
        type="submit"
        disabled={!rating || !comment.trim() || submitReview.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {submitReview.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </button>
      {submitReview.isError && (
        <p className="mt-2 text-sm text-red-600">
          Failed to submit review. Please try again.
        </p>
      )}
    </form>
  ) : (
    <div className="bg-blue-50 p-6 rounded-lg text-center">
      <p className="text-blue-600 mb-4">Please log in to write a review</p>
      <Link
        to="/login"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Log In
      </Link>
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, hotelId }) => {
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return b.rating - a.rating;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "recent" | "rating")}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReviewStats reviews={reviews} />
          <div className="mt-6">
            <WriteReview hotelId={hotelId} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500">
                  Be the first to review this hotel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
