import privateRequest from "@/shared/lib/api";

export const fetchWorkspaceOrganisation = async () => {
  const [hotelResponse, restaurantResponse] = await Promise.all([
    privateRequest.get("/properties/hotels", { params: { page: 1, limit: 1 } }),
    privateRequest.get("/properties/restaurants", { params: { page: 1, limit: 1 } }),
  ]);

  return {
    hotel: hotelResponse.data?.data?.collection?.[0] ?? null,
    restaurant: restaurantResponse.data?.data?.collection?.[0] ?? null,
  };
};
