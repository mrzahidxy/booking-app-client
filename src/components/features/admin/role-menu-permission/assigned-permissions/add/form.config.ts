import * as yup from "yup";

// Product Schema Validation
export const AssignedPermissionSchema = yup.object({
  roleId: yup.number().min(1, "Select a role").required(),
  permissionIds: yup.array().of(yup.number()).min(1, "Select at least one permission").required(),
});

// Type Definitions
export type AssignedPermissionCreate = yup.InferType<typeof AssignedPermissionSchema>;

// Initial Values for Form
export const InitialValues: AssignedPermissionCreate = {
  roleId: 0,
  permissionIds: [],
};

// API Response Interface
export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  message?: string;
  data?: T;
}

// Specific API Response for Product Create/Update
export type AssignedPermissionCreateUpdateApiResponse = ApiResponse;

// Uncomment and use this when integrating API calls
// import { usePost } from "@/features/api/use-post.hook";
// export type ProductApiResponse = ReturnType<typeof usePost<ProductCreate, ProductCreateUpdateApiResponse>>;
// export type ProductApiError = ProductApiResponse["error"];
