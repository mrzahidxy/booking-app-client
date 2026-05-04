import privateRequest from "@/shared/lib/api";

export const updateBookingStatus = async (
  id: number,
  values: { status: string }
) => {
  const response = await privateRequest.put(`/bookings/status/${id}`, values);
  return response.data;
};
