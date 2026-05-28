"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cancelStripeCheckoutSession } from "@/features/payments/api";
import { RequireUserArea } from "@/components/features/profile/RequireUserArea";

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
    <RequireUserArea>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6 text-center">
        <XCircle className="h-14 w-14 text-muted-foreground" />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">Checkout cancelled</h1>
          <p className="text-muted-foreground">
            {bookingId
              ? `Payment was cancelled for booking #${bookingId}. You can return to the booking and try again.`
              : "Your payment was not completed. You can return to your bookings and try again."}
          </p>
        </div>

        <Card className="w-full border-border shadow-sm">
          <CardContent className="p-4 text-sm text-muted-foreground">
            {isPending
              ? "Updating the payment status..."
              : "The booking remains available for another payment attempt."}
          </CardContent>
        </Card>

        <Button asChild>
          <Link href="/booking">Back to bookings</Link>
        </Button>
      </div>
    </RequireUserArea>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
