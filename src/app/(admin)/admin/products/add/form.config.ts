// import { usePost } from "@/features/api";
// import { usePost } from "@/features/api/use-post.hook";
import * as yup from "yup";

export const ProductSchema = yup.object().shape({
  name: yup.string().label("Product Name").min(1).max(50).required(),
  description: yup.string().label("Description").min(4).required(),
  price: yup.number().label("Price").min(1).required(),
  tags: yup.array().of(yup.string()).nullable(),
  image: yup.mixed().label("Image").nullable(),
});

export type ProductCreate = yup.InferType<typeof ProductSchema>;

export const InitialValue: ProductCreate = {
  name: "",
  description: "",
  price: 0,
  tags: [],
  image: "",
};

export interface ProductCreateUpdateApiResponse {
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  message?: string;
  data?: null;
}

// export type ProductApiResponse = ReturnType<
//   typeof usePost<ProductCreate, ProductCreateUpdateApiResponse>
// >;

// export type LoginCreateApiError = ProductApiResponse["error"];
