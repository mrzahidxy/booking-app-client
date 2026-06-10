"use client";

import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CalendarDays, CreditCard, Hotel, Utensils } from "lucide-react";

import privateRequest from "@/shared/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/entities/booking";

const fetchBookings = async () => {
  const response = await privateRequest.get("/bookings");
  return response.data.data?.collection ?? response.data.data ?? [];
};

const statusTone = (status?: string) => {
  switch (String(status ?? "").toUpperCase()) {
    case "CONFIRMED":
      return "bg-success/10 text-success";
    case "PENDING":
      return "bg-warning/15 text-warning";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive";
    case "COMPLETED":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const paymentTone = (status?: string) => {
  switch (String(status ?? "").toUpperCase()) {
    case "SUCCEEDED":
      return "bg-success/10 text-success";
    case "FAILED":
      return "bg-destructive/10 text-destructive";
    case "PENDING":
      return "bg-warning/15 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function BookingSummaryPage() {
  const { status } = useSession();
  const isSessionReady = status === "authenticated";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["booking-summary"],
    queryFn: fetchBookings,
    enabled: isSessionReady,
  });

  const bookings: Booking[] = Array.isArray(data) ? data : [];
  const activeBookings = bookings.filter((booking) =>
    ["PENDING", "CONFIRMED"].includes(String(booking.status).toUpperCase())
  );
  const completedBookings = bookings.filter(
    (booking) => String(booking.status).toUpperCase() === "COMPLETED"
  );
  const restaurantBookings = bookings.filter(
    (booking) => booking.property?.kind === "RESTAURANT"
  );
  const hotelBookings = bookings.filter(
    (booking) => booking.property?.kind === "HOTEL" || booking.roomId
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Booking Summary</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of current reservations, payments, and follow-up states.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Booking Summary</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of current reservations, payments, and follow-up states.
          </p>
        </div>
        <Card className="border-border shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Unable to load your booking summary.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Booking Summary</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of current reservations, payments, and follow-up states.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/booking">Open booking history</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard icon={<CalendarDays className="h-5 w-5" />} label="Total bookings" value={bookings.length} />
        <SummaryCard icon={<Hotel className="h-5 w-5" />} label="Hotel bookings" value={hotelBookings.length} />
        <SummaryCard icon={<Utensils className="h-5 w-5" />} label="Restaurant bookings" value={restaurantBookings.length} />
        <SummaryCard icon={<CreditCard className="h-5 w-5" />} label="Active bookings" value={activeBookings.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Active / Upcoming</CardTitle>
            <CardDescription>Bookings that still need attention or travel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active bookings right now.</p>
            ) : (
              activeBookings.slice(0, 4).map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Recently finished bookings and reservations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed bookings yet.</p>
            ) : (
              completedBookings.slice(0, 4).map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const target =
    booking.property?.name ?? booking.room?.property?.name ?? "Booking";
  const bookingType =
    booking.property?.kind === "RESTAURANT" ? "Restaurant" : "Hotel";
  const paymentStatus = booking.paymentStatus ?? "UNPAID";

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{target}</p>
          <p className="text-sm text-muted-foreground">
            {bookingType} • {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "-"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={statusTone(booking.status)}>{booking.status ?? "UNKNOWN"}</Badge>
          <Badge className={paymentTone(paymentStatus)}>{paymentStatus}</Badge>
        </div>
      </div>
    </div>
  );
}
