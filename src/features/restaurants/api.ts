import privateRequest, { publicRequest } from "@/shared/lib/api";
import type { Restaurant, RestaurantAPIResponse } from "@/entities/restaurant";

export type RestaurantListParams = {
  page?: number;
  limit?: number;
};

export type RestaurantSearchParams = RestaurantListParams & {
  query: string;
};

export type RestaurantMenuItemInput = {
  name: string;
  price: number;
};

export type RestaurantPayload = {
  name: string;
  location: string;
  description: string;
  cuisine: string[];
  seats: number;
  menu: RestaurantMenuItemInput[];
  image: string[];
};

export const fetchRestaurants = async (params?: RestaurantListParams) => {
  const response = await publicRequest.get<RestaurantAPIResponse>("/restaurants", {
    params,
  });
  return response.data.data;
};

export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
  const response = await publicRequest.get(`/restaurants/${id}`);
  return response.data.data;
};

export const searchRestaurants = async (params: RestaurantSearchParams) => {
  const response = await publicRequest.get<RestaurantAPIResponse>(
    "/restaurants/search/result",
    { params }
  );
  return response.data.data;
};

export const checkRestaurantAvailability = async (params: {
  restaurantId: string;
  partySize: number;
  date: string;
  timeSlot: string;
}) => {
  const response = await publicRequest.get("/restaurants/reservation/check", {
    params,
  });
  return response.data.data;
};

export const createRestaurantReservation = async (payload: {
  restaurantId: string;
  partySize: number;
  bookingDate: string;
  timeSlot: string;
}) => {
  return privateRequest.post("/restaurants/reservation", payload);
};

export const createRestaurant = async (payload: RestaurantPayload) => {
  const response = await privateRequest.post("/restaurants", payload);
  return response.data;
};

export const updateRestaurant = async (id: string, payload: RestaurantPayload) => {
  const response = await privateRequest.put(`/restaurants/${id}`, payload);
  return response.data;
};

export const deleteRestaurant = async (id: string) => {
  const response = await privateRequest.delete(`/restaurants/${id}`);
  return response.data;
};
