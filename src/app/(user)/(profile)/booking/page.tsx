"use client";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {};
type Order = {
  id: number;
  netAmount: string;
  address: string;
  status: string;
  createdAt: string;
  user: { name: string };
};

const BookingPage = (props: Props) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => {
        return (
          <Link href={`/order/${row.original.id}`}>{row?.original?.id}</Link>
        );
      },
    },
    {
      accessorKey: "room.hotel.name",
      header: "Hotel",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => {
        let date = new Date(row?.original?.createdAt);
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
