"use client";

import { useQuery } from "@tanstack/react-query";
import HotelCard from "@/components/common/HotelCard.component";
import { fetchHotels } from "@/features/hotels/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { HotelData } from "@/entities/hotel";

const fetchPopularHotels = () => fetchHotels({ page: 1, limit: 10 });

export default function PopularHotels() {
  const { data, isLoading, isError } = useQuery<HotelData>({
    queryKey: ["hotels", "popular"],
    queryFn: fetchPopularHotels,
  });

  if (isLoading) {
    return (
      <section className="py-16" aria-busy="true">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Popular Hotels</h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            data-testid="popular-hotels-loading"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[400px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Popular Hotels</h3>
          <p role="alert" className="text-sm text-muted-foreground">
            Unable to load hotels right now. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const hotels = data?.collection?.slice(0, 5) ?? [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Popular Hotels</h3>
        {hotels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hotels found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
