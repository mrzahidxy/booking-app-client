import { useState } from "react";
import { Button } from "../ui/button";
import { stripeClient } from "@/shared/lib/stripe-client";
import { toast } from "@/shared/hooks/use-toast";
import { createStripeCheckoutSession } from "@/features/payments/api";

export default function PayButton({ bookingId }: { bookingId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await createStripeCheckoutSession(bookingId);
      const stripe = await stripeClient();
      const sessionId = response?.sessionId;

      if (!stripe || !sessionId) {
        throw new Error("Payment setup failed");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error?.userMessage ?? "Unable to start payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" onClick={handlePayment} disabled={isLoading}>
      {isLoading ? "Redirecting..." : "Pay"}
    </Button>
  );
}
