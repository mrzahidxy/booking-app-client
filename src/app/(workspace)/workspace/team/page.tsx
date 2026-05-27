"use client";

import { useSession } from "next-auth/react";

import { RequireWorkspaceOwner } from "@/components/features/workspace/RequireWorkspaceOwner";
import { TenantMembersTable } from "@/components/features/workspace/team/tenant-members-table.component";
import { getPrimaryTenantId } from "@/shared/lib/session";

export default function WorkspaceTeamPage() {
  const { data: session } = useSession();
  const tenantId = getPrimaryTenantId(session);

  if (!tenantId) {
    return null;
  }

  return (
    <RequireWorkspaceOwner tenantId={tenantId}>
      <TenantMembersTable tenantId={tenantId} />
    </RequireWorkspaceOwner>
  );
}
