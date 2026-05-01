

// ✅ Assigned Permission Module
// ✅ Permission Type
export interface TPermission {
    id: number;
    name: string;
  }
  
  // ✅ Pagination Info Type
  export interface TPagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  // ✅ Main API Response Type
  export interface TPermissionsResponse {
    message: string;
    statusCode: number;
    data: {
      collection: TPermission[];
      pagination: TPagination;
    };
  }
  

export interface TRolePermissionsByIdResponse {
    message: string;
    statusCode: number;
    data: TRolePermissionsDataById;
  }
  
  export interface TRolePermissionsDataById {
    roleId: number;
    roleName: string;
    permissionIds: number[];
  }
  