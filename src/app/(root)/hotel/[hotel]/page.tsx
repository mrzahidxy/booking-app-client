import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Wifi, Car, Coffee, ChevronLeft, Bed, BadgeInfo } from "lucide-react";



import HotelImageGallery from "../HotelImageGallery.component";
import HotelRooms from "../HotelRooms.component";
import { Review } from "@/components/common/review.component";
import { publicRequest } from "@/healper/privateRequest";
import { THotel } from "@/models/hotel";

// Fetch data
const fetchHotelDetails = async (slug: string): Promise<THotel | null> => {
  try {
    const response = await publicRequest.get(`/hotels/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type PageProps = {
  params: { hotel: string };
};

export default async function HotelDetailPage({ params }: PageProps) {
  const hotelData = await fetchHotelDetails(params.hotel);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to search
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary" className="flex items-center">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
              {hotelData?.ratings}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-2">{hotelData?.name}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {hotelData?.location}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            <HotelImageGallery images={hotelData?.image!} />

            {/* Hotel Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">
                    About this hotel
                  </h3>
                  <p>
                    {hotelData?.description}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="amenities" className="grid grid-cols-2 gap-4">
                {
                  hotelData?.amenities?.map((amenity: any) => (
                    <div className="flex items-center gap-2" key={amenity}>
                      <BadgeInfo className="h-4 w-4" />
                      <span>{amenity}</span>
                    </div>
                  ))
                }
               
              </TabsContent>
              <TabsContent value="reviews">
                <Review id={hotelData?.id!} type="hotel" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <Calendar mode="range" className="rounded-md border" /> */}
                <Separator />
                {/* Room Types */}
                <HotelRooms rooms={hotelData?.rooms} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
