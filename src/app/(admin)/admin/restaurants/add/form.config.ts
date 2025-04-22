import * as yup from "yup";

const menuItemSchema = yup.object({
  name: yup.string().required("Menu item name is required"),
  price: yup
    .number()
    .positive("Price must be a positive number")
    .required("Price is required"),
});

// 🔹 Restaurant Schema Validation
export const RestaurantSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required("Restaurant Name is required"),
  location: yup.string().required("Location is required"),
  image: yup.mixed().nullable(),
  cuisine: yup.array(yup.string()).nullable(),
  menu: yup.array().of(menuItemSchema).nullable(), // optional if you allow empty menus
});

// 🔹 Type Definitions
export type RestaurantCreate = yup.InferType<typeof RestaurantSchema>;

// 🔹 Initial Values for Form
export const InitialValues: RestaurantCreate = {
  id: null,
  name: "",
  location: "",
  image: [],
  cuisine: [],
  menu: [],
};

// 🔹 API Response Interface
export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

// 🔹 Specific API Response for Restaurant Create/Update
export type RestaurantCreateUpdateApiResponse = ApiResponse<RestaurantCreate>;
