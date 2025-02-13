"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";

type Props = {};

const UserPage = (props: Props) => {
  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
    //   cell: ({ row }) => {
    //     return (
    //       <div className="text-2xl cursor-pointer">
    //         {/* Pass refetch to refresh data when status is updated */}
    //         <StatusUpdateDialog id={row.original.id} />
    //       </div>
    //     );
    //   },
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/users"
        title="Users"
        queryKey="usersList"
      />
    </Suspense>
  );
};

export default UserPage;
