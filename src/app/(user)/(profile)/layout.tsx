"use client";

import type { ReactNode } from "react";

import { ProfileShell } from "@/components/features/profile/ProfileShell.component";
import { RequireUserArea } from "@/components/features/profile/RequireUserArea";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <RequireUserArea>
      <main className="py-4 sm:py-6">
        <ProfileShell>{children}</ProfileShell>
      </main>
    </RequireUserArea>
  );
};

export default RootLayout;
