import { searchHotels } from "@/features/hotels/api";
import { searchRestaurants } from "@/features/restaurants/api";
import type { HotelData } from "@/entities/hotel";
import type { RestaurantData } from "@/entities/restaurant";
import type { SearchParams, SearchType } from "./types";

export const searchCatalog = async (
  type: SearchType,
  params: SearchParams
): Promise<HotelData | RestaurantData> => {
  if (type === "hotels") {
    return searchHotels(params);
  }
  return searchRestaurants(params);
};
