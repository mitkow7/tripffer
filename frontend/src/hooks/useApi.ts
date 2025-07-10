import React from "react";

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
          console.error("Registration error details:", errorData);
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

export function useCurrentUser() {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "http://localhost:8000/api/accounts/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
}

export function useUserBookings() {
  return {
    data: { data: [] },
    isLoading: false,
    error: null,
  };
}

export function useCreateBooking() {
  return {
    mutateAsync: async (data: any) => {
      console.log("Booking attempt:", data);
      // Replace with your actual API call
      throw new Error("Backend not connected");
    },
    isPending: false,
  };
}

export function useFavorites() {
  return {
    data: { data: [] },
    isLoading: false,
    error: null,
  };
}

export function useToggleFavorite() {
  return {
    mutate: (data: any) => {
      console.log("Toggle favorite:", data);
      // Replace with your actual API call
    },
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
