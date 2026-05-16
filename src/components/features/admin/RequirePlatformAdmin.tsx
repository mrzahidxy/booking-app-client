"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { isPlatformAdminSession } from "@/shared/lib/session";

export const RequirePlatformAdmin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();
  const router = useRouter();
  const isPlatformAdmin = isPlatformAdminSession(data);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !isPlatformAdmin) {
      router.replace("/admin");
    }
  }, [status, isPlatformAdmin, router]);

  if (status !== "authenticated" || !isPlatformAdmin) {
    return null;
  }

  return <>{children}</>;
};
