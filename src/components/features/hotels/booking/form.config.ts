import * as yup from "yup";

// 🔹 Booking Schema Validation
export const BookingSchema = yup.object({
  roomId: yup.number().nullable(),
  bookingDate: yup.string().required("Booking Date is required"), // Ensuring valid date type
  quantity: yup
    .number()
    .required("Number of rooms is required")
    .min(1, "Minimum 1 room")
    .max(4, "Maximum 4 rooms"),
});

// 🔹 Type Definitions
export type BookingCreate = yup.InferType<typeof BookingSchema>;

// 🔹 Initial Values for Booking Form
export const InitialBookingValues: BookingCreate = {
  roomId: null,
  bookingDate: "",
  quantity: 1,
};

// 🔹 API Response Interface
export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

// 🔹 Specific API Response for Booking Create/Update
export type BookingCreateUpdateApiResponse = ApiResponse<BookingCreate>;
