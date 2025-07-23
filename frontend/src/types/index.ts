export interface Trip {
  id: string;
  title: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

export interface Booking {
  id: string;
  trip: Trip;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  totalPrice: number;
}

export interface Favorite {
  id: string;
  trip: Trip;
}

export interface UserProfile {
  phone_number: string;
  date_of_birth: string;
  bio: string;
  profile_picture: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  role: "USER" | "HOTEL";
  profile?: UserProfile;
  hotel?: {
    name: string;
    stars: number;
    address: string;
    website: string;
    description: string;
    features: string;
    images: { id: number; image: string }[];
    rooms: Room[];
  };
}

export interface Room {
  id: number;
  price: number;
  description: string;
  bed_count: number;
  room_type: string;
}
