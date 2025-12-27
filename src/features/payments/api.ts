import privateRequest, { publicRequest } from "@/shared/lib/api";

export const createStripeCheckoutSession = async (bookingId: number) => {
  const response = await privateRequest.post(`/payments/${bookingId}`);
  return response.data;
};

export const sendStripeWebhookEvent = async (payload: unknown) => {
  const response = await publicRequest.post("/payments/webhook", payload);
  return response.data;
};
