"use client";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

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
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  return (
    <div className="container">
      <h4 className="font-semibold text-xl">Booking List</h4>

      <Suspense fallback={<div>Loading...</div>}>
        {userId ? (
          <DynamicTable
            url={`/bookings`}
            columns={columns}
            queryKey="bookings-list"
          />
        ) : (
          <p className="text-gray-700">No bookings found.</p>
        )}
      </Suspense>
    </div>
  );
};

export default BookingPage;
