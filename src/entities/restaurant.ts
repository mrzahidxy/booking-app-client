export interface RestaurantMenuItem {
  name: string;
  price: number | string;
}

export interface Restaurant {
  id: number;
  tenantId?: number;
  slug: string;
  name: string;
  location: string;
  image: string[];
  description: string;
  cuisine: string;
  seats: number;
  menu: string | RestaurantMenuItem[];
  timeSlots?: string;
  rating?: number;
  ratings?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantData {
  collection: Restaurant[];
  pagination: Pagination;
}

export interface RestaurantAPIResponse {
  message: string;
  statusCode: number;
  data: RestaurantData;
}

 interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
