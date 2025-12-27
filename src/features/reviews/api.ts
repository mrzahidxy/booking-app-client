import { publicRequest } from "@/shared/lib/api";

export type ReviewListParams = {
  page?: number;
  limit?: number;
  hotelId?: number;
  restaurantId?: number;
};

export type ReviewPayload = {
  userId: number;
  hotelId?: number;
  restaurantId?: number;
  rating: number;
  review: string;
};

export type ReviewUpdatePayload = Pick<ReviewPayload, "rating" | "review">;

export const fetchReviews = async (params?: ReviewListParams) => {
  const response = await publicRequest.get("/reviews", { params });
  return response.data;
};

export const createReview = async (payload: ReviewPayload) => {
  const response = await publicRequest.post("/reviews", payload);
  return response.data;
};

export const updateReview = async (id: number, payload: ReviewUpdatePayload) => {
  const response = await publicRequest.put(`/reviews/${id}`, payload);
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await publicRequest.delete(`/reviews/${id}`);
  return response.data;
};
