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

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile?: {
    profile_picture?: string;
  };
  hotel_profile?: {
    hotel_name: string;
    address: string;
    website: string;
    description: string;
    hotel_stars: number;
    hotel_image: string;
  };
}
