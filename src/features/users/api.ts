import axios from "axios";
import privateRequest from "@/shared/lib/api";

export type UserListParams = {
  page?: number;
  limit?: number;
};

export type UserRecord = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

export type UsersListResponse = {
  message?: string;
  statusCode?: number;
  data: {
    collection: UserRecord[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export type UpdateUserPayload = {
  name?: string;
  phone?: string;
};

export const fetchUsers = async (params?: UserListParams) => {
  const response = await privateRequest.get<UsersListResponse>("/users", {
    params,
  });
  return response.data;
};

export const fetchUserById = async (id: number | string) => {
  const response = await privateRequest.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload
) => {
  const response = await privateRequest.put(`/users/${id}`, payload);
  return response.data;
};

export const saveFcmToken = async (fcmToken: string) => {
  const response = await privateRequest.put("/users/fcm", { fcmToken });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await privateRequest.get("/users/me");
  return response.data.data;
};

export const updateCurrentUser = async (payload: UpdateUserPayload) => {
  const response = await privateRequest.put("/users/me", payload);
  return response.data;
};
