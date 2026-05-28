"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStripeCheckoutSession } from "@/features/payments/api";
import { RequireUserArea } from "@/components/features/profile/RequireUserArea";

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

  return (
    <RequireUserArea>
      {!sessionId ? (
        <StateShell
          icon={<AlertTriangle className="h-12 w-12 text-warning" />}
          title="Payment session missing"
          description="We could not verify this payment because the session id is missing."
        >
          <Button asChild>
            <Link href="/booking">Back to bookings</Link>
          </Button>
        </StateShell>
      ) : isLoading ? (
        <StateShell
          icon={<Clock3 className="h-12 w-12 animate-pulse text-muted-foreground" />}
          title="Checking payment status"
          description="We are verifying your checkout session."
        />
      ) : isError ? (
        <StateShell
          icon={<AlertTriangle className="h-12 w-12 text-destructive" />}
          title="Unable to verify payment"
          description={(error as any)?.userMessage ?? "Please check your booking history."}
        >
          <Button asChild variant="outline">
            <Link href="/booking">View bookings</Link>
          </Button>
        </StateShell>
      ) : (
        (() => {
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
            <StateShell
              icon={
                isPaid ? (
                  <CheckCircle2 className="h-14 w-14 text-success" />
                ) : isFailed ? (
                  <XCircle className="h-14 w-14 text-destructive" />
                ) : (
                  <Clock3 className="h-14 w-14 text-warning" />
                )
              }
              title={
                isPaid ? "Payment successful" : isFailed ? "Payment failed" : "Payment pending"
              }
              description={
                isPaid
                  ? "Your booking payment has been confirmed."
                  : isFailed
                    ? "The payment did not complete. You can try again from your booking."
                    : "Your payment is still being finalized. Refresh if needed."
              }
            >
              <Card className="w-full border-border shadow-sm">
                <CardContent className="grid gap-2 p-4 text-left text-sm">
                  <StatusRow label="Booking status" value={bookingStatus} />
                  <StatusRow label="Payment status" value={paymentStatus} />
                  <StatusRow
                    label="Amount"
                    value={formatAmount(data?.amount ?? 0, data?.currency ?? "bdt")}
                  />
                  <StatusRow
                    label="Checkout state"
                    value={data?.stripeStatus ?? data?.stripePaymentStatus ?? data?.paymentStatus ?? "-"}
                  />
                </CardContent>
              </Card>

              {isProcessing ? (
                <p className="text-sm text-muted-foreground">
                  Final status can take a moment to update. Refresh the page if needed.
                </p>
              ) : null}

              <Button asChild className="min-w-40">
                <Link href="/booking">Go to bookings</Link>
              </Button>
            </StateShell>
          );
        })()
      )}
    </RequireUserArea>
  );
}

function StateShell({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6 text-center">
      {icon}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
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
