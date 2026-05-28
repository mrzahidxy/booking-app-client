"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  hasTenantMemberships,
  isPlatformAdminSession,
} from "@/shared/lib/session";

export const RequirePlatformAdmin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const router = useRouter();
  const isPlatformAdmin = isPlatformAdminSession(data);
  const hasTenantAccess = hasTenantMemberships(data);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !isPlatformAdmin) {
      router.replace(hasTenantAccess ? "/workspace/organisation" : "/");
    }
  }, [hasTenantAccess, status, isPlatformAdmin, router, data]);

  if (status !== "authenticated" || !isPlatformAdmin) {
    return null;
  }

  return <>{children}</>;
};
