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
  trip?: Trip;
  room?: Room;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  totalPrice: number;
  travelers: number;
  specialRequests?: string;
  type?: "trip" | "hotel";
  start_date?: string;
  end_date?: string;
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
  price_per_night: string;
  location: {
    lon: number;
    lat: number;
    name?: string;
  };
  photo_url: string | null;
  address: string;
  guest_score: number;
  distance_to_center: number;
  amenities: string[];
  description?: string;
  number_of_adults?: number;
  rooms?: Room[];
  check_in_time?: string;
  check_out_time?: string;
  contact_phone?: string;
  contact_email?: string;
  reviews?: Review[];
  images?: RoomImage[];
}

export interface FavoriteHotel {
  id: string;
  user: string;
  hotel: Hotel;
  created_at: string;
}

export interface RoomImage {
  id: number;
  image: string;
}

export interface Room {
  id: number;
  price: string;
  description: string | null;
  bed_count: number;
  max_adults: number;
  room_type: string;
  images: RoomImage[];
  hotel_name?: string;
  hotel_address?: string;
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

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}
