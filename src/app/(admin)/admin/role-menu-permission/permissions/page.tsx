"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

const PermissionPage = () => {
  const columns: ColumnDef<any>[] = [{ accessorKey: "name", header: "Name" }];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/role-permission/permissions"
          title="Permissions"
          description="View the permission keys that gate API access."
          queryKey="permissionsList"
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default PermissionPage;
