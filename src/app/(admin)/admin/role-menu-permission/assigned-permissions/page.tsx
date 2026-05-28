"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense } from "react";
import TableActionButtons from "@/components/common/table-actions.component";
import { useRouter } from "next/navigation";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const AssignedPermissionsPage = () => {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "roleName",
      header: "Role Name",
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <ul>
          {row.original.permissions?.map((permission: string) => (
            <li key={permission}>{permission}</li>
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
          showDelete={false}
          showView={false}
          onEdit={(id) =>
            router.push(
              `/admin/role-menu-permission/assigned-permissions/edit/${id}`
            )
          }
        />
      ),
    },
  ];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/role-permission/assigned-permissions"
          title="Assigned Permissions"
          description="Review which permissions are bundled into each role."
          queryKey="assigned-permissions-list"
          buttonText="Assign Permission"
          handleAdd={() =>
            router.push("/admin/role-menu-permission/assigned-permissions/add")
          }
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default AssignedPermissionsPage;
