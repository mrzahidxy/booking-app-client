"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiEdit2, FiBell, FiMenu, FiX, FiUser } from "react-icons/fi";

type Props = {};

export const AdminNavbar = (props: Props) => {
  const [dropdownVisible, setDropDownVisible] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [fixedNavbar, setFixedNavbar] = useState<number>(0);

  const handleDropdownClick = () => {
    setDropDownVisible(!dropdownVisible);
  };

  const handleScrollHeight = () => {
    setFixedNavbar(window.scrollY);
  };

  useEffect(() => {
    addEventListener("scroll", handleScrollHeight);
  }, []);

  return (
    <nav
      className={`w-full border-b border-border bg-white/90 py-3 shadow-sm shadow-slate-900/5 backdrop-blur ${
        fixedNavbar > 100 ? "fixed z-50" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">BuyNow</h2>
        {showSidebar && (
          <div className="absolute right-0 top-0 z-50 min-h-screen w-1/2 border-l border-border bg-background/95">
            <button
              className="block w-full border-b border-border p-3 text-left md:hidden"
              onClick={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
            >
              <FiX />
            </button>
            <div className="mt-2 space-y-2 pl-3">
              <div className="flex flex-row items-center gap-4">
                <Link href="/" className="w-6 text-2xl text-primary">
                  <FiBell />
                </Link>
                <span className="text-lg font-semibold">Alerts</span>
              </div>

              <div className="flex flex-row items-center gap-4">
                <Link href="/review" className="w-6 text-2xl text-action">
                  <FiEdit2 />
                </Link>
                <span className="text-lg font-semibold">Review</span>
              </div>

              <div className="flex flex-row items-center gap-4" onClick={handleDropdownClick}>
                <span className="text-lg font-semibold">Profile</span>
              </div>
            </div>
          </div>
        )}

        <button
          className="block rounded-full border border-border p-2 text-foreground md:hidden"
          onClick={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
        >
          <FiMenu />
        </button>

        <div className="hidden items-center gap-6 text-2xl md:flex">
          <div className="relative group" onClick={handleDropdownClick}>
            <FiUser />
            {dropdownVisible && (
              <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-border bg-white py-2 shadow-lg shadow-slate-900/10">
                <Link
                  href={"#"}
                  className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
                >
                  Profile
                </Link>
                <button className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
