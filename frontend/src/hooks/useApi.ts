import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/api";
import axios from "axios";

interface UserProfile {
  id: number;
  phone_number?: string;
  date_of_birth?: string;
  bio?: string;
  profile_picture?: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile?: UserProfile;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  bio?: string;
  profile_picture?: File;
}

// Placeholder hooks for your custom backend integration
// Replace these with your actual API calls when backend is ready

export function useSearchTrips(filters: any) {
  return {
    data: { data: [] },
    isLoading: false,
    error: null,
  };
}

export function useTrip(id: string) {
  return {
    data: null,
    isLoading: false,
    error: null,
  };
}

export function useFeaturedTrips() {
  return {
    data: { data: [] },
    isLoading: false,
    error: null,
  };
}

export function useFeaturedHotels() {
  return useQuery({
    queryKey: ["featuredHotels"],
    queryFn: async () => {
      const response = await api.get("/hotels/search/");
      return response.data;
    },
  });
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      remember_me?: boolean;
    }) => {
      const response = await axios.post<LoginResponse>(
        "/api/accounts/login/",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error: any) => {
      if (error.response?.data?.error) {
        throw error;
      } else {
        throw new Error("Email or password is incorrect");
      }
    },
  });
};

export function useRegister() {
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  return {
    mutateAsync: async (data: any) => {
      setIsPending(true);
      setIsError(false);
      try {
        const response = await fetch(
          "http://localhost:8000/api/accounts/register/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }
        return await response.json();
      } finally {
        setIsPending(false);
      }
    },
    isPending,
    isError,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await api.get("/accounts/profile/");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error;
      }
    },
    select: (data: User) => {
      // Ensure profile data is properly structured
      return {
        ...data,
        profile: data.profile || {
          phone_number: "",
          date_of_birth: "",
          bio: "",
          profile_picture: "",
        },
      };
    },
  });
}

export function useMyHotel() {
  return useQuery({
    queryKey: ["myHotel"],
    queryFn: async () => {
      try {
        const response = await api.get("/hotels/my-hotel/");
        return response.data;
      } catch (error: unknown) {
        console.error("Failed to fetch hotel data:", error);
        throw error;
      }
    },
    enabled: !!localStorage.getItem("accessToken"),
    retry: 1,
  });
}

export function useHotelDetails(hotelId: string) {
  return useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () =>
      api.get(`/hotels/search/${hotelId}/`).then((res) => res.data),
    enabled: !!hotelId,
  });
}

export function useUserBookings() {
  return useQuery({
    queryKey: ["userBookings"],
    queryFn: async () => {
      const hotelBookingsResponse = await api.get("/hotels/bookings/");
      const hotelBookings = hotelBookingsResponse.data.map((booking: any) => ({
        ...booking,
        type: "hotel",
        totalPrice: booking.total_price,
      }));

      return hotelBookings;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      startDate,
      endDate,
    }: {
      bookingId: string;
      startDate: string;
      endDate: string;
    }) =>
      api.post(`/hotels/bookings/${bookingId}/reschedule/`, {
        start_date: startDate,
        end_date: endDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.delete(`/hotels/bookings/${bookingId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
}

export function useCreateBooking() {
  return {
    mutateAsync: async (data: any) => {
      try {
        // Replace with your actual API call
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to create booking" };
      }
    },
    isPending: false,
  };
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favoriteHotels"],
    queryFn: async () => {
      const response = await api.get("/hotels/favorites/");
      return response.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      try {
        const response = await api.post("/hotels/favorites/", {
          hotel_id: hotelId,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to add to favorites"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteHotels"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      try {
        const response = await api.delete(`/hotels/favorites/${favoriteId}/`);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to remove from favorites"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteHotels"] });
    },
  });

  return async (hotelId: string, isFavorited: boolean, favoriteId?: string) => {
    try {
      if (isFavorited && favoriteId) {
        await deleteMutation.mutateAsync(favoriteId);
      } else {
        await createMutation.mutateAsync(hotelId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  };
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      old_password: string;
      new_password: string;
      new_password_confirm: string;
    }) => {
      try {
        const response = await api.post("/accounts/change-password/", {
          old_password: data.old_password,
          new_password: data.new_password,
          new_password_confirm: data.new_password_confirm,
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to change password"
        );
      }
    },
  });
}

export function useHotelReviews(hotelId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["hotelReviews", hotelId],
    queryFn: async () => {
      const response = await api.get(`/hotels/reviews/?hotel_id=${hotelId}`);
      return response.data;
    },
    enabled: !!hotelId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      rating,
      comment,
    }: {
      hotelId: number;
      rating: number;
      comment: string;
    }) => {
      try {
        console.log("Submitting review with data:", {
          hotel: hotelId,
          rating,
          comment,
        });
        const response = await api.post("/hotels/reviews/", {
          hotel: Number(hotelId),
          rating: Number(rating),
          comment: comment.trim(),
        });
        return response.data;
      } catch (error: any) {
        console.error("Review submission error details:", {
          error: error.response?.data || error,
          status: error.response?.status,
          requestData: error.config?.data,
        });
        // Throw a more informative error
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            error.message ||
            "Failed to submit review"
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate both the reviews list and the specific review
      queryClient.invalidateQueries({
        queryKey: ["hotelReviews", variables.hotelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["hotelDetails", String(variables.hotelId)],
      });
      return data;
    },
  });
}

export function useHotelBookings() {
  return useQuery({
    queryKey: ["hotelBookings"],
    queryFn: async () => {
      const response = await api.get("/hotels/my-hotel/bookings/");
      return response.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: string;
    }) => {
      const response = await api.patch(`/hotels/bookings/${bookingId}/`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelBookings"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      try {
        let formData = new FormData();

        // Add all text fields
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "profile_picture" && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "string") {
              formData.append(key, value);
            }
          }
        });

        const response = await api.put("/accounts/profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to update profile"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const formData = new FormData();
        
        // Add hotel fields to FormData
        formData.append('name', data.hotel_name || '');
        formData.append('address', data.hotel_address || '');
        formData.append('website', data.hotel_website || '');
        formData.append('contact_email', data.hotel_contact_email || '');
        formData.append('contact_phone', data.hotel_contact_phone || '');
        formData.append('price_per_night', data.hotel_price_per_night || '');
        formData.append('availability_start_date', data.hotel_availability_start_date || '');
        formData.append('availability_end_date', data.hotel_availability_end_date || '');
        formData.append('features', data.hotel_features || '');
        formData.append('description', data.hotel_description || '');

        // Add images if they exist
        if (data.hotel_images && data.hotel_images.length > 0) {
          data.hotel_images.forEach((image: File, index: number) => {
            formData.append('images', image);
          });
        }

        const response = await api.put(
          "/hotels/my-hotel/update_hotel/",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Failed to update hotel"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHotel"] });
    },
  });
}
