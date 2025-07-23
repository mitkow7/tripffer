import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../config/api";
import Button from "../../components/ui/Button";
import { Star, AlertTriangle } from "lucide-react";

interface AddReviewFormProps {
  hotelId: string;
  onSuccess: () => void;
}

const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReview: {
      hotel_id: string;
      rating: number;
      comment: string;
    }) => api.post("/hotels/reviews/", newReview).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelDetails"] });
    },
  });
};

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  hotelId,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const addReviewMutation = useAddReview();
  const [hoverRating, setHoverRating] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const rating = watch("rating", 0);

  const onSubmit = async (data: any) => {
    setApiError(null);
    try {
      await addReviewMutation.mutateAsync({ ...data, hotel_id: hotelId });
      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setApiError(error.response.data.detail);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3" />
          <span>{apiError}</span>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                type="button"
                key={ratingValue}
                onClick={() => setValue("rating", ratingValue)}
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
        <input
          type="hidden"
          {...register("rating", { required: "Rating is required" })}
        />
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">
            {errors.rating.message as string}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience..."
        ></textarea>
      </div>
      <Button type="submit" loading={addReviewMutation.isPending}>
        Submit Review
      </Button>
    </form>
  );
};

export default AddReviewForm;
