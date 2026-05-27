"use client";

import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import {
  deleteTenantMember,
  fetchTenantMembers,
  TenantMember,
} from "@/features/workspace/team-api";
import { useToast } from "@/shared/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  getPrimaryTenantId,
  isTenantOwnerSession,
} from "@/shared/lib/session";

const roleVariant = (role: TenantMember["role"]) =>
  role === "OWNER" ? "warning" : "secondary";

export const TenantMembersTable = ({ tenantId }: { tenantId: number }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isTenantOwner = isTenantOwnerSession(session);
  const sessionTenantId = getPrimaryTenantId(session);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tenant-members", tenantId],
    queryFn: () => fetchTenantMembers(tenantId),
    enabled:
      status === "authenticated" &&
      isTenantOwner &&
      sessionTenantId === tenantId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (memberId: number) => deleteTenantMember(tenantId, memberId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenant member removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-members", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-stats"] });
    },
    onError: (mutationError: any) => {
      toast({
        title: "Error",
        description:
          mutationError?.response?.data?.message ||
          "Failed to remove tenant member.",
        variant: "destructive",
      });
    },
  });

  const columns: ColumnDef<TenantMember>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
      cell: ({ row }) => row.original.user.name ?? "Unnamed",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Tenant Role",
      cell: ({ row }) => (
        <Badge variant={roleVariant(row.original.role)} className="rounded-full">
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          onEdit={(id) =>
            router.push(`/workspace/team/edit/${id}`)
          }
          onDelete={(id) => deleteMutation.mutate(Number(id))}
          showView={false}
          loading={deleteMutation.isPending}
        />
      ),
    },
  ];

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status !== "authenticated") {
    return null;
  }

  if (!isTenantOwner || sessionTenantId !== tenantId) {
    return null;
  }

  if (isError) {
    return <div>Error fetching tenant members: {(error as Error).message}</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Tenant Members
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage owner and staff access for{" "}
              <span className="font-medium text-slate-700">
                {data?.data.tenant.name ?? "this tenant"}
              </span>
              .
            </p>
          </div>
          <Button
            className="h-10 rounded-lg px-4 text-sm font-semibold shadow-sm"
            onClick={() => router.push("/workspace/team/add")}
          >
            Add member
          </Button>
        </div>

        <DataTable columns={columns} data={data?.data.collection ?? []} />
      </section>
    </Suspense>
  );
};
