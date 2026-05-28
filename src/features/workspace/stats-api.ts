import privateRequest from "@/shared/lib/api";

export type WorkspaceStatsResponse = {
  message?: string;
  statusCode?: number;
  data: {
    totals: Record<string, number>;
    bookingsByStatus: Record<string, number>;
    paymentsByStatus: Record<string, number>;
    revenue: number;
  };
};

export const fetchWorkspaceStats = async () => {
  const response = await privateRequest.get<WorkspaceStatsResponse>("/admin/stats");
  return response.data.data;
};
