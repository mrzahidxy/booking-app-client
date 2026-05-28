import * as yup from "yup";

export enum TimeSlotType {
  MORNING = "MORNING",
  NOON = "NOON",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

const menuItemSchema = yup.object({
  name: yup.string().required("Menu item name is required"),
  price: yup
    .number()
    .positive("Price must be a positive number")
    .required("Price is required"),
});

export const RestaurantSchema = yup.object({
  id: yup.number().nullable(),
  tenantId: yup.number().nullable(),
  name: yup.string().required("Restaurant name is required"),
  location: yup.string().required("Location is required"),
  image: yup.mixed().nullable(),
  description: yup.string().nullable(),
  cuisine: yup.string().required("Cuisine is required"),
  menu: yup.array().of(menuItemSchema).nullable(),
  timeSlots: yup.string().required("Time slots are required"),
  seats: yup.number().min(1, "Seats are required").required("Seats are required"),
});

export type RestaurantCreate = yup.InferType<typeof RestaurantSchema>;

export const InitialValues: RestaurantCreate = {
  id: null,
  tenantId: null,
  name: "",
  location: "",
  image: [],
  description: "",
  cuisine: "",
  menu: [],
  timeSlots: "",
  seats: 1,
};

export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

export type RestaurantCreateUpdateApiResponse = ApiResponse<RestaurantCreate>;
