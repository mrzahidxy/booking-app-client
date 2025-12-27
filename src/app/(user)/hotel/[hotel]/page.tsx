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
          <h1 className="text-2xl font-semibold mb-2">Hotel not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load this hotel. Please try again.
          </p>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const priceValues = (hotelData.rooms ?? [])
    .map((room) => room.price)
    .filter((price) => typeof price === "number");
  const minPrice =
    priceValues.length > 0 ? Math.min(...priceValues) : undefined;
  const maxPrice =
    priceValues.length > 0 ? Math.max(...priceValues) : undefined;
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
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search/hotels">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to search
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <Badge className="flex items-center border-emerald-200 bg-emerald-50 text-emerald-700">
              <Star className="h-3 w-3 mr-1 fill-emerald-500 text-emerald-500" />
              {ratingValue}
            </Badge>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {hotelData.name}
              </h1>
              <p className="text-muted-foreground flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                {hotelData.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            <HotelImageGallery images={hotelData.image ?? []} />

            {/* Hotel Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted/70 p-1 rounded-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">
                    About this hotel
                  </h3>
                  <p>{hotelData.description}</p>
                </div>
              </TabsContent>
              <TabsContent
                value="amenities"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {amenities.map((amenity) => {
                  const iconKey = amenity.toLowerCase();
                  return (
                    <div className="flex items-center gap-3" key={amenity}>
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

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <Card className="sticky top-6" id="booking">
              <CardHeader>
                <CardTitle>Book a Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pick a room type and confirm availability for your dates.
                </p>
                <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  {hotelData.rooms?.length
                    ? "Rooms available. Select a room to continue."
                    : "No rooms available for this hotel yet."}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="text-2xl font-semibold text-primary">
                    {minPrice != null && maxPrice != null
                      ? `$${minPrice} - $${maxPrice}`
                      : "Contact for pricing"}
                  </p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </div>
                <Button className="w-full">Check Availability</Button>
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
