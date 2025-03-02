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
      accessorKey: "roleName",
      header: "Name",
    },
    {
      accessorKey: "permissions",
      header: "Permission",
      cell: ({ row }) => (
        <ul>
          {row?.original?.permissions?.map((p: string) => (
            <li>{p}</li>
          ))}
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
              `/admin/role-menu-permission/assigned-permissions/edit/${id}`
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
        url="/role-permission/assigned-permissions/"
        title="Assigned Permissions"
        queryKey="assigned-permissions-list"
        buttonText="Assign Permission"
        handleAdd={() =>
          router.push("/admin/role-menu-permission/assigned-permissions/add")
        }
      />
    </Suspense>
  );
};

export default RolePage;
