export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  originalPrice?: number;
  duration: number;
  images: string[];
  rating: number;
  reviewCount: number;
  highlights: string[];
  category:
    | "adventure"
    | "cultural"
    | "relaxation"
    | "family"
    | "luxury"
    | "budget";
  departureDate: string;
  returnDate: string;
  availableSpots: number;
  provider: {
    name: string;
    logo: string;
    rating: number;
  };
}

export interface SearchFilters {
  destination: string;
  startDate: string;
  endDate: string;
  budget: {
    min: number;
    max: number;
  };
  travelType?: string[];
  duration: {
    min: number;
    max: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface Booking {
  id: string;
  tripId: string;
  trip: Trip;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  totalPrice: number;
  travelers: number;
  specialRequests?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  price: number;
  location: {
    lon: number;
    lat: number;
    name?: string;
  };
  photo_url: string | null;
  address: string;
  guestScore: number;
  distance_to_center: number;
  amenities: string[];
}

export interface Offer {
  id: string;
  room_type: string;
  description: string;
  price: {
    total: string;
    currency: string;
  };
  policies?: {
    cancellations?: Array<{
      deadline: string;
      amount: string;
    }>;
  };
}
