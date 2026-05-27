import * as yup from "yup";

export const HotelSchema = yup.object({
  id: yup.number().nullable(),
  tenantId: yup.number().nullable(),
  name: yup.string().required("Hotel name is required"),
  location: yup.string().required("Location is required"),
  image: yup.mixed().nullable(),
  description: yup.string().nullable(),
  amenities: yup.string().nullable(),
  rooms: yup
    .array()
    .of(
      yup.object().shape({
        roomId: yup.number().nullable(),
        roomType: yup.string().required("Room type is required"),
        price: yup.number().positive("Price must be positive").required("Price is required"),
        image: yup.mixed().nullable(),
        quantity: yup.number().required("Quantity is required"),
        amenities: yup.string().nullable(),
      })
    )
    .nullable(),
});

export type HotelCreate = yup.InferType<typeof HotelSchema>;

export const InitialValues: HotelCreate = {
  id: null,
  tenantId: null,
  name: "",
  location: "",
  image: [],
  description: "",
  amenities: "",
  rooms: [
    {
      roomId: null,
      roomType: "",
      price: 0,
      image: [],
      quantity: 1,
      amenities: "",
    },
  ],
};

export interface ApiResponse<T = null> {
  isSuccess?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
}

export type HotelCreateUpdateApiResponse = ApiResponse<HotelCreate>;
