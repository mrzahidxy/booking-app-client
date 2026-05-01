import * as yup from "yup";

// Product Schema Validation
export const RoleSchema = yup.object({
  id: yup.number(),
  name: yup.string().label("Role Name").trim().min(1).max(50).required(),
});

// Type Definitions
export type RoleCreate = yup.InferType<typeof RoleSchema>;

// Initial Values for Form
export const InitialValues: RoleCreate = {
  id: 0,
  name: "",
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
export type RoleCreateUpdateApiResponse = ApiResponse;

// Uncomment and use this when integrating API calls
// import { usePost } from "@/features/api/use-post.hook";
// export type ProductApiResponse = ReturnType<typeof usePost<ProductCreate, ProductCreateUpdateApiResponse>>;
// export type ProductApiError = ProductApiResponse["error"];
