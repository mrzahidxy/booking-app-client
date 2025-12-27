import privateRequest from "@/shared/lib/api";
import type { NotificationPage } from "@/entities/notification";

export type NotificationListParams = {
  page?: number;
  limit?: number;
};

export const fetchNotifications = async (params?: NotificationListParams) => {
  const response = await privateRequest.get<NotificationPage>(
    "/notifications",
    { params }
  );
  return response.data;
};

export const markNotificationAsRead = async (id: number) => {
  const response = await privateRequest.patch(`/notifications/${id}/read`);
  return response.data;
};
