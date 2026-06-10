export interface BookingProperty {
  id: number;
  tenantId?: number;
  kind?: "HOTEL" | "RESTAURANT";
  slug?: string;
  name?: string;
  location?: string;
}

export interface BookingUser {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
}

export interface BookingRoom {
  id: number;
  propertyId?: number;
  property?: BookingProperty;
  roomType?: string;
  price?: number;
}

export interface Booking {
  id: number;
  tenantId?: number;
  userId?: number;
  user?: BookingUser;
  propertyId?: number;
  property?: BookingProperty;
  roomId?: number;
  room?: BookingRoom;
  totalPrice?: number | string;
  roomQuantity?: number;
  partySize?: number;
  timeSlot?: string;
  paymentStatus?: string;
  bookingDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
