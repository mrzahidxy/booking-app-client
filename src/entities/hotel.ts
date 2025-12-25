export interface HotelAPIResponse {
  message: string;
  statusCode: number;
  data: HotelData;
}

export interface HotelData {
  collection: Hotel[];
  pagination: Pagination;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  image: string[];
  description: string;
  amenities: string[];
  createdAt: string;
  updateAt: string;
  ratings: number;
  rooms: HotelRoom[];
}

export interface HotelRoom {
  id: number;
  hotelId: number;
  price: number;
  image: string[];
  roomType: "SINGLE" | "DOUBLE" | "TWIN" | "TRIPLE";
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type THotel = Hotel;
export type TRoom = HotelRoom;
export type THotelData = HotelData;
