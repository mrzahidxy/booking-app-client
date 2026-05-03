"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchRestaurants } from "@/features/restaurants/api";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { RestaurantData } from "@/entities/restaurant";

const fetchFeaturedRestaurants = () => fetchRestaurants({ page: 1, limit: 10 });

export default function FeaturedRestaurants() {
  const { data, isLoading, isError } = useQuery<RestaurantData>({
    queryKey: ["restaurants", "featured"],
    queryFn: fetchFeaturedRestaurants,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50/80" aria-busy="true">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">Featured Restaurants</h3>
            <span className="text-sm text-muted-foreground">Handpicked spots</span>
          </div>
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
            data-testid="featured-restaurants-loading"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[340px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-slate-50/80">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">Featured Restaurants</h3>
            <span className="text-sm text-muted-foreground">Handpicked spots</span>
          </div>
          <p role="alert" className="text-sm text-muted-foreground">
            Unable to load restaurants right now. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const restaurants = data?.collection?.slice(0, 5) ?? [];

  if (restaurants.length === 0) {
    return (
      <section className="py-16 bg-slate-50/80">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight">Featured Restaurants</h3>
            <span className="text-sm text-muted-foreground">Handpicked spots</span>
          </div>
          <p className="text-sm text-muted-foreground">No restaurants found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50/80">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">Featured Restaurants</h3>
          <span className="text-sm text-muted-foreground">Handpicked spots</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {restaurants.map((restaurant) => {
            const cuisine = Array.isArray(restaurant.cuisine)
              ? restaurant.cuisine.join(", ")
              : restaurant.cuisine;

            return (
              <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id} className="h-full">
                <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <Image
                    src={restaurant.image?.[0] ?? "/images/main-banner.jpg"}
                    alt={restaurant.name ?? "Restaurant"}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h4 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-foreground">
                        {restaurant.name}
                      </h4>
                      <Badge variant="success" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {restaurant.rating ?? restaurant.ratings ?? 0}
                      </Badge>
                    </div>
                    <p className="mb-2 min-h-[3rem] flex-1 text-sm leading-6 text-muted-foreground">
                      {cuisine} • $$$ • {restaurant.location}
                    </p>
                    <Button variant="action" className="mt-4 w-full">
                      Reserve a Table
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
