"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const UserPage = () => {
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
      cell: ({ row }) => (
        <span className="font-medium text-primary">
          {row.original?.email}
        </span>
      ),
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
    }
  ];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/users"
          title="Users"
          description="Manage system users and their access profiles."
          queryKey="usersList"
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default UserPage;
