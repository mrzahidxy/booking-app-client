"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const AssignedRolesPage = () => {
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "User Name" },
    {
      accessorKey: "role",
      header: "Role Name",
      cell: ({ row }) => row.original.role?.name ?? "Unassigned",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          onEdit={(id) => router.push(`/admin/role-menu-permission/assigned-roles/edit/${id}`)}
          showDelete={false}
        />
      ),
    },
  ];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/role-permission/assigned-roles"
          title="Platform Role Assignments"
          description="Map platform roles to users. Tenant owner and staff membership are managed separately."
          queryKey="assigned-roles-list"
          buttonText="Assign Platform Role"
          handleAdd={() => router.push("/admin/role-menu-permission/assigned-roles/add")}
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default AssignedRolesPage;
