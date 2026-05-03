"use client";

import { useQuery } from "@tanstack/react-query";
import HotelCard from "@/components/common/HotelCard.component";
import { fetchHotels } from "@/features/hotels/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
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
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Featured stays
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">Popular hotels</h3>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Handpicked properties with the comfort, service, and location travelers look for first.
            </p>
          </div>
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
            data-testid="popular-hotels-loading"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[392px] w-full" />
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
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Featured stays
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">Popular hotels</h3>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Handpicked properties with the comfort, service, and location travelers look for first.
            </p>
          </div>
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
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Featured stays
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">Popular hotels</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="max-w-xl text-sm text-muted-foreground">
              Handpicked properties with the comfort, service, and location travelers look for first.
            </p>
            <Link href="/search/hotels" className="whitespace-nowrap text-sm font-semibold text-primary">
              Browse all
            </Link>
          </div>
        </div>
        {hotels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hotels found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
