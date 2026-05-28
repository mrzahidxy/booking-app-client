import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BadgeInfo,
  ChevronLeft,
  Coffee,
  MapPin,
  Snowflake,
  Star,
  Tv,
  Utensils,
  Wifi,
} from "lucide-react";

import HotelImageGallery from "@/components/features/hotels/HotelImageGallery.component";
import HotelRooms from "@/components/features/hotels/HotelRooms.component";
import { Review } from "@/components/common/review.component";
import { fetchHotelById } from "@/features/hotels/api";

type PageProps = {
  params: { hotel: string };
};

export default async function HotelDetailPage({ params }: PageProps) {
  const hotelData = await fetchHotelById(params.hotel).catch((error) => {
    console.error(error);
    return null;
  });

  if (!hotelData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Hotel not found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t load this hotel. Please try again.
          </p>
          <Button asChild>
            <Link href="/search/hotels">Back to search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const priceValues = (hotelData.rooms ?? [])
    .map((room) => room.price)
    .filter((price) => typeof price === "number");
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : undefined;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : undefined;
  const ratingValue = Math.round((hotelData.ratings ?? 0) * 10) / 10;
  const amenities = hotelData.amenities ?? [];
  const amenityIcons: Record<string, JSX.Element> = {
    wifi: <Wifi className="h-4 w-4 text-emerald-600" />,
    coffee: <Coffee className="h-4 w-4 text-emerald-600" />,
    restaurant: <Utensils className="h-4 w-4 text-emerald-600" />,
    ac: <Snowflake className="h-4 w-4 text-emerald-600" />,
    tv: <Tv className="h-4 w-4 text-emerald-600" />,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search/hotels">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to search
              </Link>
            </Button>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <Badge variant="success" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {ratingValue}
            </Badge>
            <Badge variant="outline">{hotelData.rooms?.length ?? 0} rooms</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {hotelData.name}
              </h1>
              <p className="mt-2 flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {hotelData.location}
              </p>
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
                {hotelData.description}
              </p>
            </div>

            <Card className="border-border shadow-sm">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-2xl font-semibold text-primary">
                    {minPrice != null && maxPrice != null
                      ? `BDT ${minPrice.toLocaleString()} - BDT ${maxPrice.toLocaleString()}`
                      : "Contact for pricing"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">per night, depending on room type</p>
                <Button asChild className="w-full">
                  <a href="#booking">Book now</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <HotelImageGallery images={hotelData.image ?? []} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="rounded-full bg-muted/70 p-1.5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About this hotel</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {hotelData.description}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {amenities.map((amenity) => {
                  const iconKey = amenity.toLowerCase();
                  return (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3" key={amenity}>
                      {amenityIcons[iconKey] ?? (
                        <BadgeInfo className="h-4 w-4 text-emerald-600" />
                      )}
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="reviews">
                <Review id={hotelData.id} type="hotel" />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6 border-border shadow-sm" id="booking">
              <CardHeader>
                <CardTitle>Book a Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pick a room type and confirm availability for your dates.
                </p>

                <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {hotelData.rooms?.length
                    ? "Rooms available. Select a room to continue."
                    : "No rooms available for this hotel yet."}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="text-2xl font-semibold text-primary">
                    {minPrice != null && maxPrice != null
                      ? `BDT ${minPrice.toLocaleString()} - BDT ${maxPrice.toLocaleString()}`
                      : "Contact for pricing"}
                  </p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">•</span>
                    Free cancellation up to 24 hours
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">•</span>
                    No prepayment needed
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">•</span>
                    Best price guaranteed
                  </div>
                </div>

                <Separator />
                <HotelRooms rooms={hotelData.rooms ?? []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
