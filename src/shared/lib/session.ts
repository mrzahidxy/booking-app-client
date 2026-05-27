import type { Session } from "next-auth";

export const normalizeRole = (role?: unknown) =>
  typeof role === "string" ? role.toUpperCase() : "";

const getTenantMembership = (session?: Session | null) =>
  (session?.user?.tenantMembership?.tenant?.isActive === false
    ? null
    : session?.user?.tenantMembership) ??
  session?.user?.tenantMemberships?.find(
    (membership) => membership.tenant?.isActive !== false
  ) ??
  null;

export const hasTenantMemberships = (session?: Session | null) =>
  Boolean(getTenantMembership(session));

export const getTenantMembershipRole = (session?: Session | null) =>
  getTenantMembership(session)?.role ?? null;

export const getPrimaryTenantId = (session?: Session | null) =>
  isPlatformAdminSession(session)
    ? null
    : getTenantMembership(session)?.tenantId ?? null;

export const isPlatformAdminSession = (session?: Session | null) =>
  normalizeRole(session?.user?.role) === "ADMIN";

export const isTenantMemberSession = (session?: Session | null) =>
  !isPlatformAdminSession(session) && hasTenantMemberships(session);

export const isTenantOwnerSession = (session?: Session | null) =>
  getTenantMembershipRole(session) === "OWNER";

export const isWorkspaceUserSession = (session?: Session | null) =>
  isPlatformAdminSession(session) || hasTenantMemberships(session);

export const getWorkspaceProfileHref = (session?: Session | null) =>
  isWorkspaceUserSession(session) ? "/admin/profile" : "/profile";
