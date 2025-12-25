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
      <section className="py-16 bg-secondary/10" aria-busy="true">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
            data-testid="featured-restaurants-loading"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-[320px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
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
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
          <p className="text-sm text-muted-foreground">No restaurants found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {restaurants.map((restaurant) => {
            const cuisine = Array.isArray(restaurant.cuisine)
              ? restaurant.cuisine.join(", ")
              : restaurant.cuisine;

            return (
              <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                <Card className="overflow-hidden">
                  <Image
                    src={restaurant.image?.[0] ?? "/images/main-banner.jpg"}
                    alt={restaurant.name ?? "Restaurant"}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{restaurant.name}</h4>
                      <Badge variant="secondary" className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {restaurant.rating ?? restaurant.ratings ?? 0}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {cuisine} • $$$ • {restaurant.location}
                    </p>
                    <Button className="w-full">Reserve a Table</Button>
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
