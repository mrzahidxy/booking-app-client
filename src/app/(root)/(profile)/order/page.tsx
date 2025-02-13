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

const OrdersPage = (props: Props) => {
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
      accessorKey: "netAmount",
      header: "Amount",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  return (
    <div className="container">
      <h4 className="font-semibold text-xl">Orders List</h4>

      <Suspense fallback={<div>Loading...</div>}>
        {userId ? (
          <DynamicTable
            url={`/orders/users/me`}
            columns={columns}
            queryKey="userOrderList"
          />
        ) : (
          <p className="text-gray-700">No orders found.</p>
        )}
      </Suspense>
    </div>
  );
};

export default OrdersPage;
