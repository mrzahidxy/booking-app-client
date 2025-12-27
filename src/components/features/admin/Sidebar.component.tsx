"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiUser, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { cn } from "@/shared/utils";

const Sidebar = () => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <FiBarChart2 className="text-lg" />,
    },
    {
      href: "/admin/users",
      label: "User",
      icon: <FiUser className="text-lg" />,
    },
    {
      href: "",
      label: "Role Menu Permission",
      icon: <FiUser className="text-lg" />,
      children: [
        { href: "/admin/role-menu-permission/roles", label: "Roles" },
        {
          href: "/admin/role-menu-permission/assigned-permissions",
          label: "Assign Permission",
        },
        {
          href: "/admin/role-menu-permission/assigned-roles",
          label: "Assign Role",
        },
      ],
    },
    {
      href: "",
      label: "Hotel",
      icon: <FiUser className="text-lg" />,
      children: [
        { href: "/admin/hotels", label: "Hotels" },
        { href: "/admin/restaurants", label: "Restaurants" },
      ],
    },
    {
      href: "/admin/booking",
      label: "Booking",
      icon: <FiUser className="text-lg" />,
    },
  ];

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-[260px] flex-col border-r border-slate-200 bg-white px-4 py-6">
      <Link
        href="/admin"
        className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold text-primary"
      >
        Gontobbo
      </Link>

      <nav className="flex-1 space-y-1 text-sm font-medium text-slate-600">
        {links.map(({ href, label, icon, children }) => {
          const isActive = href && pathname === href;
          const isChildActive = children?.some(
            (child) => pathname === child.href
          );
          const isSectionOpen = Boolean(isChildActive || openSection === label);

          if (children?.length) {
            return (
              <div key={label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(label)}
                  aria-expanded={isSectionOpen}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                    isSectionOpen
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {icon}
                  <span className="flex-1">{label}</span>
                  <FiChevronDown
                    className={cn(
                      "text-sm transition-transform",
                      isSectionOpen && "rotate-180"
                    )}
                  />
                </button>
                {isSectionOpen && (
                  <div className="ml-9 space-y-1 border-l border-slate-200 pl-3">
                    {children.map(({ href: subHref, label: subLabel }) => {
                      const isSubActive = pathname === subHref;
                      return (
                        <Link
                          key={subHref}
                          href={subHref}
                          aria-current={isSubActive ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-2 py-1.5 text-sm transition",
                            isSubActive
                              ? "text-blue-600"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          {subLabel}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-slate-100 hover:text-slate-900"
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
