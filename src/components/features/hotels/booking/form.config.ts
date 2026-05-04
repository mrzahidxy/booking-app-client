import * as yup from "yup";

export const BookingSchema = yup.object({
  roomId: yup.number().nullable(),
  bookingDate: yup.string().required("Booking Date is required"),
  quantity: yup
    .number()
    .required("Number of rooms is required")
    .min(1, "Minimum 1 room")
    .max(4, "Maximum 4 rooms"),
});

export type BookingCreate = yup.InferType<typeof BookingSchema>;

export const InitialBookingValues: BookingCreate = {
  roomId: null,
  bookingDate: "",
  quantity: 1,
};
