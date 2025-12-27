"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const { data } = useSession();
  const router = useRouter();
  const userRole =
    typeof data?.user?.role === "string"
      ? data.user.role.toUpperCase()
      : data?.user?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated" && userRole === "ADMIN") {
      router.push("/admin");
    }
  }, [status, userRole, router]);


  return <main className="">{children}</main>;
}
