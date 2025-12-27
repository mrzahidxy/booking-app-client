import type { Hotel } from "./hotel";
import type { Restaurant } from "./restaurant";

export interface BookingUser {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
}

export interface BookingRoom {
  id: number;
  hotelId?: number;
  hotel?: Hotel;
  roomType?: string;
  price?: number;
}

export interface Booking {
  id: number;
  userId?: number;
  user?: BookingUser;
  roomId?: number;
  room?: BookingRoom;
  restaurantId?: number;
  restaurant?: Restaurant;
  totalPrice?: number | string;
  partySize?: number;
  timeSlot?: string;
  bookingDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
