import privateRequest from "@/shared/lib/api";

export type AdminStatsResponse = {
  message?: string;
  statusCode?: number;
  data: {
    totals: Record<string, number>;
    bookingsByStatus: Record<string, number>;
    paymentsByStatus: Record<string, number>;
    revenue: number;
  };
};

export const fetchAdminStats = async () => {
  const response = await privateRequest.get<AdminStatsResponse>("/admin/stats");
  return response.data.data;
};
