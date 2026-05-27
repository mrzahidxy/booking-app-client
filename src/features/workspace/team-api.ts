import privateRequest from "@/shared/lib/api";

export type TenantMemberRole = "OWNER" | "STAFF";

export type TenantMemberUser = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  roleId: number | null;
  createdAt: string;
  updateAt: string;
};

export type TenantMember = {
  id: number;
  tenantId: number;
  userId: number;
  role: TenantMemberRole;
  createdAt: string;
  updatedAt: string;
  user: TenantMemberUser;
  tenant: {
    id: number;
    name: string;
    slug: string;
    isActive: boolean;
  };
};

export type TenantMembersResponse = {
  message?: string;
  statusCode?: number;
  data: {
    tenant: {
      id: number;
      name: string;
      slug: string;
      isActive: boolean;
    };
    collection: TenantMember[];
  };
};

export type TenantMemberDetailResponse = {
  message?: string;
  statusCode?: number;
  data: TenantMember;
};

export const fetchTenantMembers = async (tenantId: number) => {
  const response = await privateRequest.get<TenantMembersResponse>(
    `/admin/tenants/${tenantId}/members`
  );
  return response.data;
};

export const createTenantMember = async (
  tenantId: number,
  payload: { userId: number; role: TenantMemberRole }
) => {
  const response = await privateRequest.post<TenantMemberDetailResponse>(
    `/admin/tenants/${tenantId}/members`,
    payload
  );
  return response.data;
};

export const updateTenantMemberRole = async (
  tenantId: number,
  memberId: number,
  payload: { role: TenantMemberRole }
) => {
  const response = await privateRequest.patch<TenantMemberDetailResponse>(
    `/admin/tenants/${tenantId}/members/${memberId}`,
    payload
  );
  return response.data;
};

export const deleteTenantMember = async (tenantId: number, memberId: number) => {
  const response = await privateRequest.delete(
    `/admin/tenants/${tenantId}/members/${memberId}`
  );
  return response.data;
};
