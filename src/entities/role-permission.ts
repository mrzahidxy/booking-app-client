export interface TPermission {
  id: number;
  name: string;
}

export interface TPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TPermissionsResponse {
  message: string;
  statusCode: number;
  data: {
    collection: TPermission[];
    pagination: TPagination;
  };
}

export interface TRolePermissionsDataById {
  roleId: number;
  roleName: string;
  permissionIds: number[];
}

export interface TRolePermissionsByIdResponse {
  message: string;
  statusCode: number;
  data: TRolePermissionsDataById;
}

export interface TAssignedPermissionRow {
  roleId: number;
  roleName: string;
  permissions: string[];
}

export interface TAssignedPermissionsResponse {
  message: string;
  statusCode: number;
  data: {
    collection: TAssignedPermissionRow[];
    pagination: TPagination;
  };
}
