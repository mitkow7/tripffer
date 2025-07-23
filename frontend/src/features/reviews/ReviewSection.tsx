import React, { useState } from "react";
import { Review } from "../../types/api";
import { Star, UserCircle } from "lucide-react";
import AddReviewForm from "./AddReviewForm";
import Button from "../../components/ui/Button";

interface ReviewSectionProps {
  reviews: Review[];
  hotelId: string;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, hotelId }) => {
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Guest Reviews
      </h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <UserCircle className="h-8 w-8 text-gray-500 mr-3" />
                <div>
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet for this hotel.</p>
      )}
      <div className="mt-6">
        <Button onClick={() => setShowAddReviewForm(!showAddReviewForm)}>
          {showAddReviewForm ? "Cancel" : "Write a Review"}
        </Button>
        {showAddReviewForm && (
          <div className="mt-4">
            <AddReviewForm
              hotelId={hotelId}
              onSuccess={() => setShowAddReviewForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
