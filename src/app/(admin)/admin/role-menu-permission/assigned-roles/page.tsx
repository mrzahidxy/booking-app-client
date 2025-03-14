"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import queryClient from "@/app/config/queryClient";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const AssignedRolesPage = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return await privateRequest.delete(`/role-permission/assigned-roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-roles-list"] });
    },
  });

  const handleDelete = (id: number) => {
    mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "User Name" },
    { accessorKey: "Role.name", header: "Role Name" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          onEdit={(id) => router.push(`/admin/role-menu-permission/assigned-roles/edit/${id}`)}
          onDelete={(id) => handleDelete(Number(id))}
          loading={isPending}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/role-permission/assigned-roles"
        title="Assigned Roles"
        queryKey="assigned-roles-list"
        buttonText="Assign Role"
        handleAdd={() => router.push("/admin/role-menu-permission/assigned-roles/add")}
      />
    </Suspense>
  );
};

export default AssignedRolesPage;
