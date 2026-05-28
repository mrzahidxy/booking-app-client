// next-auth.d.ts
import { DefaultSession } from "next-auth";

type TenantMembership = {
  tenantId: number;
  role: "OWNER" | "STAFF";
  tenant?: {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
  };
};

// Extend the default session and user types
declare module "next-auth" {
  interface Session {
    user: {
      token: string; 
      role: string;
      tenantMembership?: TenantMembership;
      tenantMemberships?: TenantMembership[];
    } & DefaultSession["user"];
  }

  interface User {
    token: string;
    role: string;
    tenantMembership?: TenantMembership;
    tenantMemberships?: TenantMembership[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantMembership?: TenantMembership;
    tenantMemberships?: TenantMembership[];
    token?: string;
    role?: string;
    id?: string | number;
    name?: string | null;
    email?: string | null;
  }
}
