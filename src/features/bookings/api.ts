import privateRequest, { publicRequest } from "@/shared/lib/api";

export type BookingListParams = {
  page?: number;
  limit?: number;
};

export type RoomBookingPayload = {
  roomId: number;
  bookingDate: string;
  quantity: number;
};

export type RestaurantBookingPayload = {
  restaurantId: number;
  bookingDate: string;
  timeSlot: string;
  partySize: number;
};

export const fetchBookings = async (params?: BookingListParams) => {
  const response = await privateRequest.get("/bookings", { params });
  return response.data;
};

export const fetchAdminBookings = async (params?: BookingListParams) => {
  const response = await privateRequest.get("/bookings/admin", { params });
  return response.data;
};

export const createRoomBooking = async (payload: RoomBookingPayload) => {
  const response = await privateRequest.post("/bookings/room", payload);
  return response.data;
};

export const createRestaurantBooking = async (
  payload: RestaurantBookingPayload
) => {
  const response = await privateRequest.post("/bookings/restaurant", payload);
  return response.data;
};

export const updateBookingStatus = async (
  id: number,
  values: { status: string; type: string }
) => {
  const response = await privateRequest.put(`/bookings/status/${id}`, values);
  return response.data;
};

export const checkRoomAvailability = async (params: {
  roomId: number;
  quantity: number;
  date: string;
}) => {
  const response = await publicRequest.get("/bookings/check-room", { params });
  return response.data.data;
};
