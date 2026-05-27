"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  hasTenantMemberships,
  isPlatformAdminSession,
} from "@/shared/lib/session";

export const RequireWorkspace = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPlatformAdmin = isPlatformAdminSession(session);
  const hasTenantAccess = hasTenantMemberships(session);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      router.replace("/auth/login");
      return;
    }

    if (isPlatformAdmin) {
      router.replace("/admin");
      return;
    }

    if (!hasTenantAccess) {
      router.replace("/");
    }
  }, [hasTenantAccess, isPlatformAdmin, router, status]);

  if (status !== "authenticated" || isPlatformAdmin || !hasTenantAccess) {
    return null;
  }

  return <>{children}</>;
};
