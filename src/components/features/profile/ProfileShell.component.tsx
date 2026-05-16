"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/shared/utils";
import { FiUser, FiBookOpen, FiBell, FiStar } from "react-icons/fi";

const items = [
  { href: "/profile", label: "Profile", icon: FiUser },
  { href: "/booking", label: "Bookings", icon: FiBookOpen },
  { href: "/reviews", label: "Reviews", icon: FiStar },
  { href: "/notification", label: "Notifications", icon: FiBell },
];

export const ProfileShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8 lg:py-8">
      <aside className="rounded-3xl border border-border bg-white/95 p-4 shadow-sm shadow-slate-900/5">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-action/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Account area
          </p>
          <h1 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {session?.user?.name ?? "My account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your bookings, reviews, and notifications.
          </p>
        </div>

        <nav className="mt-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
};
