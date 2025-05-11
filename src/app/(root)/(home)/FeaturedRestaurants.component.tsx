import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicRequest } from "@/healper/privateRequest";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 10; 
// Fetch data
const fetchRestaurants = async (slug: string): Promise<any> => {
  try {
    const response = await publicRequest.get("/restaurants");

    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function FeaturedRestaurants() {
  const restaurants = await fetchRestaurants("restaurants");

  if (restaurants?.collection.length === 0) {
    return (
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
          <p>No Restaurants found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Featured Restaurants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
          {restaurants?.collection?.map((restaurant: any, i: any) => (
            <Link href={`/restaurant/${restaurant?.id}`} key={i}>
              <Card key={i} className="overflow-hidden">
                <Image
                  src={restaurant?.image[0]}
                  alt="Restaurant"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{restaurant?.name}</h4>
                    <Badge variant="secondary" className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {restaurant?.rating}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {restaurant?.cuisine} • $$$ • {restaurant?.location}
                  </p>
                  {/* <div className="flex gap-2 mb-4">
                    <Badge variant="outline">Fine Dining</Badge>
                    <Badge variant="outline">Romantic</Badge>
                  </div> */}
                  <Button className="w-full">Reserve a Table</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
