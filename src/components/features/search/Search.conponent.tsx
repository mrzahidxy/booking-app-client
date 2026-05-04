"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import HotelCard from "@/components/common/HotelCard.component";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/entities/hotel";
import type { Restaurant } from "@/entities/restaurant";
import type { SearchParams, SearchType } from "@/features/search/types";
import { searchCatalog } from "@/features/search/api";

const SearchComponent = ({ type }: { type: SearchType }) => {
  const queries = useSearchParams();
  const queryKey = queries.toString();

  const searchParams = useMemo<SearchParams>(() => {
    const params = new URLSearchParams(queryKey);
    const rawQuery = params.get("query");
    const name = params.get("name");
    const location = params.get("location");
    const query =
      rawQuery ?? [name, location].filter(Boolean).join(" ");

    return {
      query: query?.trim() ?? "",
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
    };
  }, [queryKey]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search", type, searchParams],
    queryFn: () => searchCatalog(type, searchParams),
    enabled: searchParams.query.length > 0,
    staleTime: 0,
  });

  if (!searchParams.query) {
    return (
      <div className="container py-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Search Results</h2>
        <p className="text-sm text-muted-foreground">
          Enter a search term to see results.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8" aria-busy="true">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Search Results</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-[392px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "userMessage" in error
        ? String((error as { userMessage?: string }).userMessage)
        : "We couldn't load results. Please try again.";
    return (
      <div className="container py-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Search Results</h2>
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const collection = data?.collection ?? [];

  if (collection.length === 0) {
    return (
      <div className="container py-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Search Results</h2>
        <p className="text-sm text-muted-foreground">No results found.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Search Results</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {type === "hotels"
          ? (collection as Hotel[]).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          : (collection as Restaurant[]).map((restaurant) => (
              <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <Image
                    src={restaurant.image?.[0] ?? "/images/main-banner.jpg"}
                    alt={restaurant.name ?? "Restaurant"}
                    width={400}
                    height={240}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">{restaurant.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default SearchComponent;
