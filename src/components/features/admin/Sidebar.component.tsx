"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiBarChart2,
  FiUsers,
  FiBriefcase,
  FiShield,
  FiUser,
} from "react-icons/fi";

import { cn } from "@/shared/utils";
import {
  getPrimaryTenantId,
  hasTenantMemberships,
  isPlatformAdminSession,
  isTenantOwnerSession,
} from "@/shared/lib/session";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isPlatformAdmin = isPlatformAdminSession(session);
  const hasTenantAccess = hasTenantMemberships(session);
  const isTenantOwner = isTenantOwnerSession(session);
  const tenantId = getPrimaryTenantId(session);

  const links: NavItem[] = isPlatformAdmin
    ? [
        {
          href: "/admin",
          label: "Dashboard",
          icon: <FiBarChart2 className="text-lg" />,
        },
        {
          href: "/admin/tenants",
          label: "Tenants",
          icon: <FiBriefcase className="text-lg" />,
        },
        {
          href: "/admin/role-menu-permission/assigned-roles",
          label: "Platform Roles",
          icon: <FiShield className="text-lg" />,
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: <FiUsers className="text-lg" />,
        },
      ]
    : [
        {
          href: "/admin",
          label: "Dashboard",
          icon: <FiBarChart2 className="text-lg" />,
        },
        {
          href: "/admin/organisation",
          label: "Organisation",
          icon: <FiBriefcase className="text-lg" />,
        },
        {
          href: "/admin/booking",
          label: "Booking",
          icon: <FiBriefcase className="text-lg" />,
        },
        ...(isTenantOwner && tenantId
          ? [
              {
                href: `/admin/tenants/${tenantId}/members`,
                label: "Team",
                icon: <FiUsers className="text-lg" />,
              },
            ]
          : []),
        {
          href: "/admin/profile",
          label: "Account",
          icon: <FiUser className="text-lg" />,
        },
      ];

  if (!isPlatformAdmin && !hasTenantAccess) {
    return null;
  }

  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-[260px] flex-col border-r border-border bg-white/90 px-4 py-6 backdrop-blur">
      <div className="mb-6 rounded-2xl border border-border bg-muted/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {isPlatformAdmin ? "Platform admin" : "Tenant workspace"}
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {session?.user?.name ?? "Account"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 text-sm font-medium text-muted-foreground">
        {links.map(({ href, label, icon }) => {
          const isActive = href ? pathname === href : false;

          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-foreground"
              )}
            >
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
