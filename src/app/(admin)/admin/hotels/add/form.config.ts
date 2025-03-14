import * as yup from "yup";

// 🔹 Hotel Schema Validation
export const HotelSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required("Hotel Name is required"),
  location: yup.string().required("Location is required"),
  image: yup.mixed().nullable(), // ✅ Image can be optional (nullable)
  description: yup.string().nullable(),
  amenities: yup.array().of(yup.string()).nullable(), // ✅ Store amenities as an array
  rooms: yup
    .array()
    .of(
      yup.object().shape({
        roomId: yup.number().nullable(),
        roomType: yup.string().required("Room type is required"),
        price: yup.number().positive("Price must be positive").required("Price is required"),
        image: yup.mixed().nullable(),
      })
    )
    .nullable(), // ✅ Allows optional rooms array
});

// 🔹 Type Definitions
export type HotelCreate = yup.InferType<typeof HotelSchema>;

// 🔹 Initial Values for Form
export const InitialValues: HotelCreate = {
  id: null,
  name: "",
  location: "",
  image: [],
  description: "",
  amenities: [],
  rooms: [
    {
      roomId: null,
      roomType: "",
      price: 0,
      image: [],
    },
  ],
};

// 🔹 API Response Interface
export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

// 🔹 Specific API Response for Hotel Create/Update
export type HotelCreateUpdateApiResponse = ApiResponse<HotelCreate>;
