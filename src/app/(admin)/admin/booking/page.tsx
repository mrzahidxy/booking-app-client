"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusUpdateDialog } from "@/components/features/admin/booking/booking-status-update.component";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/utils";

type Props = {};

const BookingPage = (props: Props) => {
  const statusTone = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-700";
      case "CANCELLED":
        return "bg-rose-100 text-rose-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
    },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: ({ row }) => (
        <span className="font-medium text-primary">
          {row.original?.user?.email}
        </span>
      ),
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
      cell: ({ row }) => {
        const amount = row.original?.totalPrice;
        if (typeof amount === "number") {
          return `$${amount.toLocaleString()}`;
        }
        return amount ?? "-";
      },
    },
    {
      accessorKey: "partySize",
      header: "Party Size",
      cell: ({ row }) => row.original?.partySize ?? "-",
    },
    {
      accessorKey: "timeSlot",
      header: "Time Slot",
      cell: ({ row }) => (
        <span className="text-xs font-semibold uppercase text-slate-500">
          {row.original?.timeSlot ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = String(row.original?.status ?? "");
        return (
          <Badge
            className={cn(
              "border-0 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
              statusTone(status)
            )}
          >
            {status || "Unknown"}
          </Badge>
        );
      },
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
        description="Manage all your bookings"
        queryKey="bookingList"
      />
    </Suspense>
  );
};

export default BookingPage;
