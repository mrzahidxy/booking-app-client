"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import HotelCard from "@/components/common/HotelCard.component";
import { HotelAPIResponse } from "@/models/hotel";
import { publicRequest } from "@/healper/privateRequest";

const fetchHotels = async (query: string): Promise<any> => {
  try {
    const response = await publicRequest.get(`hotels/search/result?${query}`);

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const SearchComponent = () => {
  const params = useSearchParams();
  const queryString = new URLSearchParams();
  params.forEach((value, key) => {
    if (value) queryString.append(key, value);
  });

  const { data: hotels, isLoading: loading } = useQuery<HotelAPIResponse>({
    queryKey: ["hotels", queryString],
    queryFn: () => fetchHotels(queryString.toString()),
    enabled: !!queryString,
    staleTime: 0,
    refetchOnMount: params.has("name") || params.has("location"),
  });

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      {hotels?.data?.collection?.length === 0 ? (
        <p>No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 justify-center gap-6">
          {hotels?.data?.collection?.map((hotel) => (
            <HotelCard key={hotel?.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
