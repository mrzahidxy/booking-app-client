"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Utensils, Users, ChevronLeft } from "lucide-react";
import axios from "axios";
import RestaurantResarvetion from "../ResturantResarvetion.component";
import RestaurantImageGallery from "../RestaurantImageGallery.component";
import { Review } from "@/components/common/review.component";

interface Restaurant {
  id: number;
  name: string;
  location: string;
  image: string;
  cuisine: string;
  ratings: number;
  seats: number;
  menu: string;
}

const restaurantData: Restaurant = {
  id: 1,
  name: "Gourmet Fusion",
  location: "123 Culinary Street, Foodie City",
  image: "/placeholder.svg?height=400&width=600",
  cuisine: "International",
  ratings: 4.7,
  seats: 50,
  menu: "Appetizers\n- Bruschetta: $8\n- Calamari: $10\n\nMain Courses\n- Grilled Salmon: $22\n- Beef Tenderloin: $28\n\nDesserts\n- Tiramisu: $8\n- Crème Brûlée: $9",
};

// Fetch data
const fetchHotelDetails = async (slug: string): Promise<any> => {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurants/${slug}`;
  try {
    const response = await axios.get(endpoint);

    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function RestaurantDetailPage({
  params,
}: {
  params: { restaurant: string };
}) {
  const restaurantData = await fetchHotelDetails(params?.restaurant);

  console.log("restaurantData", restaurantData);
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
              {restaurantData.ratings}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-2">{restaurantData.name}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {restaurantData.location}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <RestaurantImageGallery images={[restaurantData.image]} />

            {/* Restaurant Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">
                    About this restaurant
                  </h3>
                  <p>
                    {restaurantData.name} offers a unique dining experience with
                    its {restaurantData.cuisine} cuisine. Located in the heart
                    of Foodie City, our restaurant provides a cozy atmosphere
                    perfect for both intimate dinners and group celebrations.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2" />
                      <span>{restaurantData.cuisine} Cuisine</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{restaurantData.seats} Seats</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="menu" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Menu</h3>
                  <pre className="whitespace-pre-wrap">
                    {restaurantData.menu}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <Review id={restaurantData.id} type="restaurant" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <RestaurantResarvetion restaurantData={restaurantData} />
        </div>
      </main>
    </div>
  );
}
