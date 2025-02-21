"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusUpdateDialog } from "./user-role-update.component";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const UserPage = (props: Props) => {
  const router = useRouter();
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
    }
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/users"
        title="Users"
        queryKey="usersList"
        // handleAdd={() => {router.push("/admin/users/add")}}
        // buttonText="Add User"
      />
    </Suspense>
  );
};

export default UserPage;
