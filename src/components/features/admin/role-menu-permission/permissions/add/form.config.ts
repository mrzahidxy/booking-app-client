import * as yup from "yup";

// Product Schema Validation
export const PermissionSchema = yup.object({
  id: yup.number(),
  name: yup.string().label("Permission Name").trim().min(1).max(50).required(),
});

// Type Definitions
export type PermissionCreate = yup.InferType<typeof PermissionSchema>;

// Initial Values for Form
export const InitialValues: PermissionCreate = {
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
export type PermissionCreateUpdateApiResponse = ApiResponse;

// Uncomment and use this when integrating API calls
// import { usePost } from "@/features/api/use-post.hook";
// export type ProductApiResponse = ReturnType<typeof usePost<ProductCreate, ProductCreateUpdateApiResponse>>;
// export type ProductApiError = ProductApiResponse["error"];
