"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { cancelStripeCheckoutSession } from "@/features/payments/api";

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => cancelStripeCheckoutSession(id),
  });

  useEffect(() => {
    if (!bookingId) {
      return;
    }

    mutate(Number(bookingId));
  }, [bookingId, mutate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
      <XCircle className="h-14 w-14 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Checkout cancelled</h1>
        <p className="text-muted-foreground">
          {bookingId
            ? `Payment was cancelled for booking #${bookingId}. You can return to the booking and try again.`
            : "Your payment was not completed. You can return to your bookings and try again."}
        </p>
        {isPending ? (
          <p className="text-sm text-muted-foreground">
            Updating the payment status...
          </p>
        ) : null}
      </div>
      <Button asChild>
        <Link href="/booking">Back to bookings</Link>
      </Button>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
