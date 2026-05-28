import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Utensils, Users, ChevronLeft } from "lucide-react";

import RestaurantResarvetion from "@/components/features/restaurants/ResturantResarvetion.component";
import RestaurantImageGallery from "@/components/features/restaurants/RestaurantImageGallery.component";
import { Review } from "@/components/common/review.component";
import { fetchRestaurantById } from "@/features/restaurants/api";

export default async function RestaurantDetailPage({
  params,
}: {
  params: { restaurant: string };
}) {
  const restaurantData = await fetchRestaurantById(params?.restaurant).catch(
    (error) => {
      console.error(error);
      return null;
    }
  );

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Restaurant not found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t load this restaurant. Please try again.
          </p>
          <Button asChild>
            <Link href="/search/restaurants">Back to search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cuisineList: string[] = Array.isArray(restaurantData.cuisine)
    ? restaurantData.cuisine
    : typeof restaurantData.cuisine === "string" && restaurantData.cuisine
      ? [restaurantData.cuisine]
      : [];

  const parsedMenu =
    typeof restaurantData.menu === "string"
      ? (() => {
          try {
            return JSON.parse(restaurantData.menu);
          } catch {
            return [];
          }
        })()
      : restaurantData.menu;
  const menuItems = Array.isArray(parsedMenu) ? parsedMenu : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search/restaurants">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to search
              </Link>
            </Button>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <Badge variant="success" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {restaurantData?.ratings ?? 0}
            </Badge>
            <Badge variant="outline">{restaurantData.seats ?? 0} seats</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {restaurantData.name}
              </h1>
              <p className="mt-2 flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {restaurantData.location}
              </p>
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
                {restaurantData.description}
              </p>
            </div>

            <Card className="border-border shadow-sm">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Cuisine</span>
                  <span className="text-lg font-semibold text-primary">
                    {cuisineList.length ? cuisineList.join(", ") : "Mixed menu"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Reservation based on time slot and party size</p>
                <Button asChild className="w-full">
                  <a href="#reservation">Reserve a table</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {cuisineList.slice(0, 4).map((item: string) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <RestaurantImageGallery images={restaurantData.image ?? []} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="rounded-full bg-muted/70 p-1.5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About this restaurant</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{restaurantData.description}</p>
                    <div className="flex flex-wrap gap-3 text-foreground">
                      <div className="flex items-center">
                        <Utensils className="mr-2 h-4 w-4" />
                        <span>{cuisineList.length ? cuisineList.join(", ") : "Cuisine details available on request"}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{restaurantData.seats} Seats</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="menu" className="space-y-3">
                {menuItems.length ? (
                  menuItems.map(
                    (item: { name: string; price: string | number }, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border border-border bg-white p-4"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.price}</span>
                      </div>
                    )
                  )
                ) : (
                  <Card className="border-border shadow-sm">
                    <CardContent className="py-8 text-center text-sm text-muted-foreground">
                      Menu details are not available yet.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                <Review id={restaurantData.id} type="restaurant" />
              </TabsContent>
            </Tabs>
          </div>

          <div id="reservation">
            <RestaurantResarvetion restaurantData={restaurantData} />
          </div>
        </div>
      </main>
    </div>
  );
}
