import privateRequest, { publicRequest } from "@/shared/lib/api";
import type { Restaurant, RestaurantAPIResponse } from "@/entities/restaurant";

const RESTAURANTS_ROUTE = "/properties/restaurants";

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
  const response = await publicRequest.get<RestaurantAPIResponse>(RESTAURANTS_ROUTE, {
    params,
  });
  return response.data.data;
};

export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
  const response = await publicRequest.get(`${RESTAURANTS_ROUTE}/${id}`);
  return response.data.data;
};

export const searchRestaurants = async (params: RestaurantSearchParams) => {
  const response = await publicRequest.get<RestaurantAPIResponse>(
    `${RESTAURANTS_ROUTE}/search/result`,
    { params }
  );
  return response.data.data;
};

export const checkRestaurantAvailability = async (params: {
  restaurantId: number;
  partySize: number;
  date: string;
  timeSlot: string;
}) => {
  const response = await publicRequest.get("/bookings/check-restaurant", {
    params,
  });
  return response.data.data;
};

export const createRestaurantReservation = async (payload: {
  restaurantId: number;
  partySize: number;
  bookingDate: string;
  timeSlot: string;
}) => {
  return privateRequest.post("/bookings/restaurant", payload);
};

export const createRestaurant = async (payload: RestaurantPayload) => {
  const response = await privateRequest.post(RESTAURANTS_ROUTE, payload);
  return response.data;
};

export const updateRestaurant = async (id: string, payload: RestaurantPayload) => {
  const response = await privateRequest.put(`${RESTAURANTS_ROUTE}/${id}`, payload);
  return response.data;
};

export const deleteRestaurant = async (id: string) => {
  const response = await privateRequest.delete(`${RESTAURANTS_ROUTE}/${id}`);
  return response.data;
};
