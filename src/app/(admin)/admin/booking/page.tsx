"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusUpdateDialog } from "./booking-status-update.component";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";

type Props = {};

const BookingPage = (props: Props) => {
  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "user.phone",
      header: "Phone",
    },
    {
      accessorKey: "restaurant.name",
      header: "Restaurant",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "partySize",
      header: "Party Size",
    },
    {
      accessorKey: "timeSlot",
      header: "Time Slot",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => {
        let date = new Date(row?.original?.bookingDate);
        return date.toLocaleString();
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        let date = new Date(row?.original?.createdAt);
        return date.toLocaleString();
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const type = row?.original?.roomId
          ? "room"
          : row?.original?.restaurantId
          ? "restaurant"
          : "";
        return <StatusUpdateDialog id={row.original.id} type={type} />;
      },
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/bookings/admin"
        title="Bookings"
        queryKey="bookingList"
      />
    </Suspense>
  );
};

export default BookingPage;
