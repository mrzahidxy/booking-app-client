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
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-16 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
