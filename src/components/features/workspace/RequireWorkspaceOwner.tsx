"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  getPrimaryTenantId,
  hasTenantMemberships,
  isPlatformAdminSession,
  isTenantOwnerSession,
} from "@/shared/lib/session";

export const RequireWorkspaceOwner = ({
  tenantId,
  children,
}: {
  tenantId: number;
  children: ReactNode;
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPlatformAdmin = isPlatformAdminSession(session);
  const isTenantOwner = isTenantOwnerSession(session);
  const hasTenantAccess = hasTenantMemberships(session);
  const sessionTenantId = getPrimaryTenantId(session);
  const canManageTenantMembers = isTenantOwner && sessionTenantId === tenantId;

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !canManageTenantMembers) {
      router.replace(isPlatformAdmin ? "/admin" : hasTenantAccess ? "/workspace/organisation" : "/");
    }
  }, [
    canManageTenantMembers,
    hasTenantAccess,
    isPlatformAdmin,
    router,
    status,
  ]);

  if (status !== "authenticated" || !canManageTenantMembers) {
    return null;
  }

  return <>{children}</>;
};
