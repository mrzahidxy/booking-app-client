import privateRequest, { publicRequest } from "@/shared/lib/api";

export type ReviewListParams = {
  page?: number;
  limit?: number;
  hotelId?: number;
  restaurantId?: number;
};

export type ReviewPayload = {
  propertyId?: number;
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
  const response = await privateRequest.post("/reviews", payload);
  return response.data;
};

export const updateReview = async (id: number, payload: ReviewUpdatePayload) => {
  const response = await privateRequest.put(`/reviews/${id}`, payload);
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await privateRequest.delete(`/reviews/${id}`);
  return response.data;
};
