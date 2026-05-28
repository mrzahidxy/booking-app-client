"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const RolePage = () => {
  const columns: ColumnDef<any>[] = [{ accessorKey: "name", header: "Name" }];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/role-permission/roles"
          title="Roles"
          description="View the platform roles that are used for access checks."
          queryKey="rolesList"
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default RolePage;
