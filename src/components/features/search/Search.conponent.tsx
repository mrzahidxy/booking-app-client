"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import HotelCard from "@/components/common/HotelCard.component";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    const query = rawQuery ?? [name, location].filter(Boolean).join(" ");

    return {
      query: query?.trim() ?? "",
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
    };
  }, [queryKey]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["search", type, searchParams],
    queryFn: () => searchCatalog(type, searchParams),
    enabled: searchParams.query.length > 0,
    staleTime: 0,
  });

  const collection = data?.collection ?? [];
  const resultCount = collection.length;

  const heading =
    type === "hotels" ? "Hotel search results" : "Restaurant search results";
  const description =
    type === "hotels"
      ? "Explore stays that match your trip, location, and budget."
      : "Find restaurants that fit your group size, timing, and mood.";

  if (!searchParams.query) {
    return (
      <div className="container py-8">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">{heading}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{description}</p>
            <p>Enter a search term to see results.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8" aria-busy="true">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary" className="h-fit rounded-full px-3 py-1">
            Searching for &quot;{searchParams.query}&quot;
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-[360px] w-full" />
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
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">{heading}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resultCount === 0) {
    return (
      <div className="container py-8">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">{heading}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              No results found for &quot;{searchParams.query}&quot;.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{type}</Badge>
              <Badge variant="secondary">Page {searchParams.page}</Badge>
              <Badge variant="secondary">Limit {searchParams.limit}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Searching for &quot;{searchParams.query}&quot;
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {type === "hotels"
          ? (collection as Hotel[]).map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
          : (collection as Restaurant[]).map((restaurant) => (
              <Link href={`/restaurant/${restaurant.slug ?? restaurant.id}`} key={restaurant.id}>
                <Card className="group overflow-hidden border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <Image
                    src={restaurant.image?.[0] ?? "/images/main-banner.jpg"}
                    alt={restaurant.name ?? "Restaurant"}
                    width={400}
                    height={240}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-semibold text-foreground">{restaurant.name}</h4>
                      <Badge variant="secondary">{restaurant.ratings ?? 0}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {restaurant.description}
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
