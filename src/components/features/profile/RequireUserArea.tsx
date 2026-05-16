"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { isWorkspaceUserSession } from "@/shared/lib/session";

export const RequireUserArea = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const router = useRouter();
  const isWorkspaceUser = isWorkspaceUserSession(data);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      router.replace("/auth/login");
      return;
    }

    if (isWorkspaceUser) {
      router.replace("/admin/profile");
    }
  }, [status, isWorkspaceUser, router]);

  if (status !== "authenticated" || isWorkspaceUser) {
    return null;
  }

  return <>{children}</>;
};
