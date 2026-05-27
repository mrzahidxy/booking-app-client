"use client";

import { useSession } from "next-auth/react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireWorkspaceOwner } from "@/components/features/workspace/RequireWorkspaceOwner";
import { TenantMemberCreateUpdate } from "@/components/features/workspace/team/add/tenant-member-create-update.component";
import { getPrimaryTenantId } from "@/shared/lib/session";

export default function AddWorkspaceTeamMemberPage() {
  const { data: session } = useSession();
  const tenantId = getPrimaryTenantId(session);

  if (!tenantId) {
    return null;
  }

  return (
    <RequireWorkspaceOwner tenantId={tenantId}>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Add tenant member</CardTitle>
          <CardDescription>
            Assign an existing user to this tenant as an owner or staff member.
          </CardDescription>
        </CardHeader>
        <TenantMemberCreateUpdate tenantId={tenantId} />
      </Card>
    </RequireWorkspaceOwner>
  );
}
