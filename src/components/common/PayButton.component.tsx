import privateRequest from "@/healper/privateRequest";
import { Button } from "../ui/button";
import { stripeClient } from "@/lib/stripe-client";

export default function PayButton({ bookingId }: { bookingId: number }) {
  const handlePayment = async () => {
    const response = await privateRequest.post(`/payments/${bookingId}`);
    const stripe = await stripeClient();
    stripe?.redirectToCheckout({ sessionId: response.data.sessionId });
    window.location.reload();
  };
  return (
    <Button type="button" onClick={handlePayment}>
      Pay
    </Button>
  );
}
