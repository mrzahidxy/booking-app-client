"use client";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/entities";

type BookingRow = Booking & {
  paymentStatus?: string;
  payment?: { status?: string }[];
};

const BookingPage = () => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const columns: ColumnDef<BookingRow>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => row?.original?.id,
    },
    {
      id: "bookingName",
      header: "Hotel / Restaurant",
      cell: ({ row }) => {
        const hotelName = row.original?.room?.hotel?.name;
        const restaurantName = row.original?.restaurant?.name;
        return hotelName ?? restaurantName ?? "-";
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      id: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const paymentStatus = row.original?.paymentStatus ?? row.original?.payment?.[0]?.status ?? "UNPAID";
        const tone =
          paymentStatus === "SUCCEEDED"
            ? "border-success/20 bg-success/10 text-success"
            : paymentStatus === "FAILED"
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : paymentStatus === "PENDING"
                ? "border-warning/20 bg-warning/15 text-warning"
                : "border-border bg-muted text-muted-foreground";
        return <Badge className={tone}>{paymentStatus}</Badge>;
      },
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt ?? Date.now());
        return date.toLocaleString();
      }
    },
    {
      accessorKey: "status",
      header: "Status",
        cell: ({ row }) => {
        const status = row.original.status;
        const tone =
          status === "CONFIRMED"
            ? "border-success/20 bg-success/10 text-success"
            : status === "PENDING"
              ? "border-warning/20 bg-warning/15 text-warning"
              : "border-border bg-muted text-muted-foreground";
        return <Badge className={tone}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Booking History</h1>
        <p className="text-muted-foreground mt-1">
          Track your hotel and restaurant bookings in one place.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>View status, totals, and dates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            {userId ? (
              <DynamicTable
                url={`/bookings`}
                columns={columns}
                queryKey="bookings-list"
              />
            ) : (
              <p className="text-muted-foreground">No bookings found.</p>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
