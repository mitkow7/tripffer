import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../config/api";

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

export function useLogin() {
  return {
    mutateAsync: async (data: any) => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/accounts/login/",
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
          throw new Error(errorData.detail || "Login failed");
        }

        const responseData = await response.json();

        if (responseData.access) {
          localStorage.setItem("auth_token", responseData.access);
        }

        return responseData;
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
    isError: false,
  };
}

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
      const response = await api.get("/accounts/profile/");
      return response.data;
    },
  });
}

export function useMyHotel() {
  return useQuery({
    queryKey: ["myHotel"],
    queryFn: async () => {
      const response = await api.get("/hotels/my-hotel/");
      return response.data;
    },
    enabled: !!localStorage.getItem("auth_token"),
  });
}

export function useHotelDetails(hotelId: string) {
  return useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => api.get(`/hotels/search/${hotelId}`).then((res) => res.data),
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

      return {
        data: [...hotelBookings],
      };
    },
    enabled: !!localStorage.getItem("auth_token"),
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
    enabled: !!localStorage.getItem("auth_token"),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (hotelId: string) =>
      api.post("/hotels/favorites/", { hotel_id: hotelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteHotels"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (favoriteId: string) =>
      api.delete(`/hotels/favorites/${favoriteId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteHotels"] });
    },
  });

  return (hotelId: string, isFavorited: boolean, favoriteId?: string) => {
    if (isFavorited && favoriteId) {
      deleteMutation.mutate(favoriteId);
    } else {
      createMutation.mutate(hotelId);
    }
  };
}

export function useChangePassword() {
  const [isPending, setIsPending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  return {
    mutateAsync: async (data: {
      old_password: string;
      new_password: string;
      new_password_confirm: string;
    }) => {
      setIsPending(true);
      setIsError(false);
      try {
        const response = await fetch(
          "http://localhost:8000/api/accounts/change-password/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({
              old_password: data.old_password,
              new_password: data.new_password,
              new_password_confirm: data.new_password_confirm,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setIsError(true);
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
