import privateRequest from "@/shared/lib/api";
import type {
  TPermission,
  TPermissionsResponse,
  TRolePermissionsByIdResponse,
} from "@/entities/role-permission";

export type RolePermissionListParams = {
  page?: number;
  limit?: number;
};

export type Role = {
  id: number;
  name: string;
};

export type RoleListResponse = {
  message: string;
  statusCode: number;
  data: {
    collection: Role[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export type AssignPermissionsPayload = {
  roleId: number;
  permissionIds: number[];
};

export type AssignedRole = {
  id: number;
  userId: number;
  roleId: number;
  roleName?: string;
};

export type AssignedRolesResponse = {
  message: string;
  statusCode: number;
  data: {
    collection: AssignedRole[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export const fetchRoles = async (params?: RolePermissionListParams) => {
  const response = await privateRequest.get<RoleListResponse>(
    "/role-permission/roles",
    { params }
  );
  return response.data;
};

export const fetchRoleById = async (id: number) => {
  const response = await privateRequest.get<Role>(`/role-permission/roles/${id}`);
  return response.data;
};

export const fetchPermissions = async (params?: RolePermissionListParams) => {
  const response = await privateRequest.get<TPermissionsResponse>(
    "/role-permission/permissions",
    { params }
  );
  return response.data;
};

export const fetchPermissionById = async (id: number) => {
  const response = await privateRequest.get<TPermission>(
    `/role-permission/permissions/${id}`
  );
  return response.data;
};

export const fetchAssignedPermissions = async (
  params?: RolePermissionListParams
) => {
  const response = await privateRequest.get<TRolePermissionsByIdResponse>(
    "/role-permission/assigned-permissions",
    { params }
  );
  return response.data;
};

export const assignPermissionsToRole = async (
  payload: AssignPermissionsPayload
) => {
  const response = await privateRequest.post(
    "/role-permission/assigned-permissions",
    payload
  );
  return response.data;
};

export const fetchPermissionsForRole = async (roleId: number) => {
  const response = await privateRequest.get<TRolePermissionsByIdResponse>(
    `/role-permission/assigned-permissions/${roleId}`
  );
  return response.data;
};

export const replacePermissionsForRole = async (
  payload: AssignPermissionsPayload
) => {
  const response = await privateRequest.put(
    "/role-permission/assigned-permissions/edit",
    payload
  );
  return response.data;
};

export const fetchAssignedRoles = async (params?: RolePermissionListParams) => {
  const response = await privateRequest.get<AssignedRolesResponse>(
    "/role-permission/assigned-roles",
    { params }
  );
  return response.data;
};

export const fetchAssignedRoleForUser = async (userId: number) => {
  const response = await privateRequest.get(
    `/role-permission/assigned-roles/${userId}`
  );
  return response.data;
};

export const assignRoleToUser = async (userId: number, roleId: number) => {
  const response = await privateRequest.post(
    `/role-permission/assigned-roles/${userId}`,
    { roleId }
  );
  return response.data;
};
