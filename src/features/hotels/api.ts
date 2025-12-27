import privateRequest, { publicRequest } from "@/shared/lib/api";
import type { Hotel, HotelAPIResponse } from "@/entities/hotel";

export type HotelListParams = {
  page?: number;
  limit?: number;
};

export type HotelSearchParams = HotelListParams & {
  query: string;
};

export type HotelRoomInput = {
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "TRIPLE";
  price: number;
  image: string[];
  amenities: string[];
  quantity: number;
};

export type HotelPayload = {
  name: string;
  location: string;
  description: string;
  amenities: string[];
  image: string[];
  rooms: HotelRoomInput[];
};

export const fetchHotels = async (params?: HotelListParams) => {
  const response = await publicRequest.get<HotelAPIResponse>("/hotels", {
    params,
  });
  return response.data.data;
};

export const fetchHotelById = async (id: string): Promise<Hotel> => {
  const response = await publicRequest.get(`/hotels/${id}`);
  return response.data.data;
};

export const searchHotels = async (params: HotelSearchParams) => {
  const response = await publicRequest.get<HotelAPIResponse>(
    "/hotels/search/result",
    { params }
  );
  return response.data.data;
};

export const fetchBookedHotels = async (params?: HotelListParams) => {
  const response = await publicRequest.get<HotelAPIResponse>("/hotels/booked", {
    params,
  });
  return response.data.data;
};

export const createHotel = async (payload: HotelPayload) => {
  const response = await privateRequest.post("/hotels", payload);
  return response.data;
};

export const updateHotel = async (id: string, payload: HotelPayload) => {
  const response = await privateRequest.put(`/hotels/${id}`, payload);
  return response.data;
};

export const deleteHotel = async (id: string) => {
  const response = await privateRequest.delete(`/hotels/${id}`);
  return response.data;
};

export const checkRoomAvailability = async (params: {
  roomId: string;
  quantity: number;
  date: string;
}) => {
  const response = await publicRequest.get("/bookings/check-room", { params });
  return response.data.data;
};
