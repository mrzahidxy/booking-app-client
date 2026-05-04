"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStripeCheckoutSession } from "@/features/payments/api";

const formatAmount = (amount: number, currency: string) => {
  const minorUnits = amount / 100;
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(minorUnits);
  } catch {
    return `${currency.toUpperCase()} ${minorUnits.toFixed(2)}`;
  }
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stripe-checkout-session", sessionId],
    queryFn: () => getStripeCheckoutSession(sessionId!),
    enabled: !!sessionId,
  });

  if (!sessionId) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-warning" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Payment session missing</h1>
          <p className="text-muted-foreground">
            We could not verify this payment because the session id is missing.
          </p>
        </div>
        <Button asChild>
          <Link href="/booking">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <Clock3 className="h-12 w-12 animate-pulse text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Checking payment status</h1>
          <p className="text-muted-foreground">
            We are verifying your checkout session.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to verify payment</h1>
          <p className="text-muted-foreground">
            {(error as any)?.userMessage ?? "Please check your booking history."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/booking">View bookings</Link>
        </Button>
      </div>
    );
  }

  const isPaid =
    data?.paymentStatus === "SUCCEEDED" || data?.stripePaymentStatus === "paid";
  const isFailed =
    data?.paymentStatus === "FAILED" || data?.stripeStatus === "expired";
  const isProcessing = !isPaid && !isFailed;
  const bookingStatus = isPaid ? "CONFIRMED" : data?.bookingStatus ?? "PENDING";
  const paymentStatus = isPaid
    ? "SUCCEEDED"
    : isFailed
      ? "FAILED"
      : data?.paymentStatus ?? "PENDING";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6 text-center">
      {isPaid ? (
        <CheckCircle2 className="h-14 w-14 text-success" />
      ) : isFailed ? (
        <XCircle className="h-14 w-14 text-destructive" />
      ) : (
        <Clock3 className="h-14 w-14 text-warning" />
      )}

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">
          {isPaid
            ? "Payment successful"
            : isFailed
              ? "Payment failed"
              : "Payment pending"}
        </h1>
        <p className="text-muted-foreground">
          {isPaid
            ? "Your booking payment has been confirmed."
            : isFailed
              ? "The payment did not complete. You can try again from your booking."
              : "Your payment is still being finalized. Refresh if needed."}
        </p>
      </div>

      <div className="w-full rounded-xl border bg-card p-4 text-left">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Booking status</span>
            <span className="font-medium">{bookingStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment status</span>
            <span className="font-medium">{paymentStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              {formatAmount(data?.amount ?? 0, data?.currency ?? "bdt")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Checkout state</span>
            <span className="font-medium">
              {data?.stripeStatus ?? data?.stripePaymentStatus ?? data?.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {isProcessing ? (
        <p className="text-sm text-muted-foreground">
          Final status can take a moment to update. Refresh the page if needed.
        </p>
      ) : null}

      <Button asChild className="min-w-40">
        <Link href="/booking">Go to bookings</Link>
      </Button>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
