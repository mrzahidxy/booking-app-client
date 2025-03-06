"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import queryClient from "@/app/config/queryClient";
import { useRouter } from "next/navigation";

const RolePage = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return await privateRequest.delete(`/role-permission/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolesList"] });
    },
  });

  const handleDelete = async (id: number) => {
    mutate(id);
  };

  // Table columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Permission",
      cell: ({ row }) => (
        <ul>
          {row?.original?.Role?.name}
        </ul>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.roleId}
          showView={false}
          onEdit={(id) =>
            router.push(
              `/admin/role-menu-permission/assigned-role/edit/${id}`
            )
          }
          showDelete={false}
          // onDelete={(id) => handleDelete(+id)}
          loading={isPending}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <DynamicTable
        columns={columns}
        url="/role-permission/assigned-roles/"
        title="Assigned Roles"
        queryKey="assigned-roles-list"
        buttonText="Assign Role"
        handleAdd={() =>
          router.push("/admin/role-menu-permission/assigned-role/add")
        }
      />
    </Suspense>
  );
};

export default RolePage;
