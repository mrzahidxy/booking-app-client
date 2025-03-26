export type HotelAPIResponse = {
  message: string;
  statusCode: number;
  data: THotelData;
};

export type THotelData = {
  collection: THotel[];
  pagination: Pagination;
};

export type THotel = {
  id: number;
  name: string;
  location: string;
  image: string[];
  description: string;
  amenities: string[];
  createdAt: string;
  updateAt: string;
  ratings: number;
  rooms: TRoom[];
};

export type TRoom = {
  id: number;
  hotelId: number;
  price: number;
  image: string[];
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "TRIPLE"; // You can expand this enum if needed
  amenities: string[];
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
