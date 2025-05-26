"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import HotelCard from "@/components/common/HotelCard.component";
import { HotelAPIResponse } from "@/models/hotel";
import { publicRequest } from "@/healper/privateRequest";

const fetchSearchResults = async (query: string, type: string): Promise<any> => {
  const endpoint =
    type === "hotels"
      ? `hotels/search/result?${query}`
      : `restaurants/search/result?${query}`;
  try {
    const response = await publicRequest.get(endpoint);

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const SearchComponent = ({ type }: { type: string }) => {
  const queries = useSearchParams();
  const queryString = new URLSearchParams();
  queries.forEach((value, key) => {
    if (value) queryString.append(key, value);
  });

  const { data: hotels, isLoading: loading, error } = useQuery<HotelAPIResponse>({
    queryKey: ["hotels", queryString],
    queryFn: () => fetchSearchResults(queryString.toString(), type),
    enabled: !!queryString,
    staleTime: 0,
    refetchOnMount: queries.has("name") || queries.has("location"),
  });

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if(error) return <div className="text-center py-10">Error</div>;

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
