"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/common/Navbar.component";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar.component";
import {
  hasTenantMemberships,
  isPlatformAdminSession,
} from "@/shared/lib/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data } = useSession();
  const router = useRouter();
  const isPlatformAdmin = isPlatformAdminSession(data);
  const hasTenantAccess = hasTenantMemberships(data);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status !== "authenticated") {
      router.replace("/auth/login");
      return;
    }
    if (!isPlatformAdmin && !hasTenantAccess) {
      router.replace("/");
      return;
    }
    if (!isPlatformAdmin && hasTenantAccess) {
      router.replace("/workspace");
    }
  }, [status, isPlatformAdmin, hasTenantAccess, router]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
