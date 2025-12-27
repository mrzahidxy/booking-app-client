"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/common/Navbar.component";
import Sidebar from "@/components/features/admin/Sidebar.component";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data } = useSession();
  const router = useRouter();
  const userRole =
    typeof data?.user?.role === "string"
      ? data.user.role.toUpperCase()
      : data?.user?.role;

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status !== "authenticated") {
      router.replace("/auth/login");
      return;
    }
    if (userRole !== "ADMIN") {
      router.replace("/");
    }
  }, [status, userRole, router]);


  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
