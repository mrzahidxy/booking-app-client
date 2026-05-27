"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import privateRequest from "@/shared/lib/api";
import { useToast } from "@/shared/hooks/use-toast";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";

type TenantRow = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
};

type StatusPayload = {
  id: number;
  isActive: boolean;
};

const TenantsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, isActive }: StatusPayload) =>
      privateRequest.patch(`/admin/tenants/${id}/status`, { isActive }),
    onSuccess: (_response, variables) => {
      toast({
        title: "Success",
        description: variables.isActive
          ? "Tenant re-activated successfully."
          : "Tenant suspended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update tenant status.",
        variant: "destructive",
      });
    },
  });

  const columns: ColumnDef<TenantRow>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "secondary" : "destructive"} className="rounded-full">
          {row.original.isActive ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const isActive = Boolean(row.original.isActive);
        return (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/tenants/${row.original.id}/members`)}
            >
              Members
            </Button>
            <Button
              size="sm"
              variant={isActive ? "destructive" : "secondary"}
              onClick={() => mutate({ id: row.original.id, isActive: !isActive })}
              disabled={isPending}
            >
              {isActive ? "Suspend" : "Re-activate"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/admin/tenants"
          title="Tenants"
          description="View tenants and suspend or re-activate them from the system panel."
          queryKey="admin-tenants"
        />
      </Suspense>
    </RequirePlatformAdmin>
  );
};

export default TenantsPage;
