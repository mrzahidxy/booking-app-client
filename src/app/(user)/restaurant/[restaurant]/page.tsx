import Link from "next/link";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-2xl font-semibold mb-2">Restaurant not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load this restaurant. Please try again.
          </p>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search/restaurants">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to search
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Badge className="flex items-center border-emerald-200 bg-emerald-50 text-emerald-700">
              <Star className="h-3 w-3 mr-1 fill-emerald-500 text-emerald-500" />
              {restaurantData?.ratings ?? 0}
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
            <RestaurantImageGallery images={restaurantData.image} />

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
                  <p>{restaurantData.description}</p>
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
                    {JSON.parse(restaurantData.menu).map(
                      (
                        item: { name: string; price: string },
                        index: number
                      ) => (
                        <div key={index}>
                          <span className="font-bold">{item.name}:</span>{" "}
                          {item.price}
                        </div>
                      )
                    )}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <Review id={restaurantData.id} type="restaurant" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <RestaurantResarvetion
            restaurantData={{ slug: params?.restaurant, ...restaurantData }}
          />
        </div>
      </main>
    </div>
  );
}
