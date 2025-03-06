import * as yup from "yup";

// Product Schema Validation
export const AssignedRoleSchema = yup.object({
  id: yup.number().nullable(),
  roleId: yup.number().min(1, "Select a role").required(),
  userId:  yup.number().min(1, "Select a role").required(),
});

// Type Definitions
export type AssignedRoleCreate = yup.InferType<typeof AssignedRoleSchema>;

// Initial Values for Form
export const InitialValues: AssignedRoleCreate = {
  roleId: 0,
  userId: 0,
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
export type AssignedRoleCreateUpdateApiResponse = ApiResponse;

// Uncomment and use this when integrating API calls
// import { usePost } from "@/features/api/use-post.hook";
// export type ProductApiResponse = ReturnType<typeof usePost<ProductCreate, ProductCreateUpdateApiResponse>>;
// export type ProductApiError = ProductApiResponse["error"];
