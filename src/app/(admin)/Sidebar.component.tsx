"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <FiBarChart2 />,
    },
    {
      href: "/admin/users",
      label: "User",
      icon: <FiUser />,
    },
    {
      href: "",
      label: "Role Menu Permission",
      icon: <FiUser />,
      children: [
        { href: "/admin/role-menu-permission/roles", label: "Roles" },
        { href: "/admin/role-menu-permission/permissions", label: "Permissions" },
        { href: "/admin/roles", label: "Assign Permission" },
        { href: "/admin/roles", label: "Assign Role" },
      ],
    },
  ];

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  return (
    <div className="h-screen border w-[260px] bg-white">
      <div className="flex flex-col font-semibold">
        {links.map(({ href, label, icon, children }) => (
          <div key={label}>
            <button
              className={`w-full flex gap-2 items-center p-3 pl-8 transition duration-100 ease-in-out border-b-2 border-gray-100 ${
                pathname === href
                  ? "text-blue-500 bg-blue-100"
                  : "hover:text-blue-500 hover:bg-blue-100"
              }`}
              onClick={() => children && toggleSection(label)}
            >
              {icon}
              <span>{label}</span>
              {children && (
                <FiChevronDown
                  className={`ml-auto transform ${
                    openSection === label ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>
            {children && openSection === label && (
              <div className="pl-10 space-y-2 bg-gray-50">
                {children.map(({ href: subHref, label: subLabel }) => (
                  <Link
                    key={subHref}
                    href={subHref}
                    className={`block p-2 transition duration-100 ease-in-out ${
                      pathname === subHref
                        ? "text-blue-500"
                        : "hover:text-blue-500"
                    }`}
                  >
                    {subLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
