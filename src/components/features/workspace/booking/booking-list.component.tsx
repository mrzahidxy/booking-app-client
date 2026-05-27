"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { StatusUpdateDialog } from "@/components/features/workspace/booking/booking-status-update.component";
import { cn } from "@/shared/utils";
import { WORKSPACE_BOOKINGS_URL } from "@/features/workspace/booking-api";

export const BookingList = () => {
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

  const columns: ColumnDef<any>[] = [
    { accessorKey: "user.name", header: "Name" },
    {
      accessorKey: "user.email",
      header: "Email",
      cell: ({ row }) => (
        <span className="font-medium text-primary">
          {row.original?.user?.email}
        </span>
      ),
    },
    { accessorKey: "user.phone", header: "Phone" },
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
      cell: ({ row }) => {
        const amount = row.original?.totalPrice;
        return typeof amount === "number" ? `$${amount.toLocaleString()}` : amount ?? "-";
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
      id: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const paymentStatus =
          row.original?.paymentStatus ?? row.original?.payment?.[0]?.status ?? "UNPAID";
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
      cell: ({ row }) => new Date(row.original?.bookingDate).toLocaleString(),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original?.createdAt).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <StatusUpdateDialog id={row.original.id} />,
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url={WORKSPACE_BOOKINGS_URL}
        title="Booking"
        description="Manage bookings for your assigned property."
        queryKey="bookingList"
      />
    </Suspense>
  );
};
