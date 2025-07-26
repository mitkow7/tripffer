import React, { useState } from "react";
import { Star, User, Check, AlertCircle, LogIn } from "lucide-react";
import {
  useHotelReviews,
  useSubmitReview,
  useCurrentUser,
} from "../../hooks/useApi";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

interface ReviewSectionProps {
  hotelId: number;
}

interface Review {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const getUserName = () => {
    if (review.user.first_name && review.user.last_name) {
        return `${review.user.first_name} ${review.user.last_name}`;
    }
    return review.user.email;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
          {getUserName()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <div className="flex items-center">
            <p className="font-medium text-gray-900">{getUserName()}</p>
            {review.user.role === "HOTEL" && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                Hotel Owner
              </span>
            )}
            {review.user.role === "ADMIN" && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(review.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < review.rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ hotelId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: reviews, isLoading } = useHotelReviews(hotelId);
  const submitReview = useSubmitReview();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    try {
      await submitReview.mutateAsync({
        hotelId: Number(hotelId), // Ensure hotelId is a number
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Failed to submit review. Please try again.";
      setError(errorMessage);
    }
  };

  const getAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews: Review[]) => {
    const distribution = Array(5).fill(0);
    if (!reviews) return distribution;

    reviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  const averageRating = getAverageRating(reviews || []);
  const ratingDistribution = getRatingDistribution(reviews || []);
  const totalReviews = reviews?.length || 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>

      {/* Review Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="text-4xl font-bold text-gray-900 mr-4">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Number(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{totalReviews} reviews</p>
            </div>
          </div>

          <div className="space-y-2">
            {ratingDistribution
              .map((count, index) => ({
                stars: 5 - index,
                count,
                percentage: totalReviews ? (count / totalReviews) * 100 : 0,
              }))
              .map((rating) => (
                <div key={rating.stars} className="flex items-center">
                  <span className="w-16 text-sm text-gray-600">
                    {rating.stars} stars
                  </span>
                  <div className="flex-1 h-2 mx-4 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-gray-600">
                    {rating.count}
                  </span>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      </div>

      {/* Write a Review Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Write a Review
        </h3>

        {!currentUser && !isLoadingUser ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Please log in to write a review
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In to Review
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Review {submitReview.data?.id ? "updated" : "submitted"}{" "}
                successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setError(null);
                      }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                loading={submitReview.isPending}
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No reviews yet</div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
