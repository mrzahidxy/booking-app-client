import privateRequest from "@/shared/lib/api";

export const createStripeCheckoutSession = async (bookingId: number) => {
  const response = await privateRequest.post(`/payments/${bookingId}`);
  return response.data;
};

export const getStripeCheckoutSession = async (sessionId: string) => {
  const response = await privateRequest.get(`/payments/session/${sessionId}`);
  return response.data;
};

export const cancelStripeCheckoutSession = async (bookingId: number) => {
  const response = await privateRequest.post(`/payments/${bookingId}/cancel`);
  return response.data;
};
