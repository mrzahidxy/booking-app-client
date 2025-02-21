import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Fetch data
const fetchHotels = async (slug: string): Promise<any> => {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/hotels`;
  try {
    const response = await axios.get(endpoint);

    return response.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function PopularHotels() {
  const hotels = await fetchHotels("hotels");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Popular Hotels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
          {hotels?.map((hotel: any) => (
            <Link href={`/hotel/${hotel?.id}`}  key={hotel?.name}>
              <Card className="overflow-hidden">
                <Image
                  src={hotel?.image}
                  alt="Hotel"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{hotel?.name}</h4>
                    <Badge variant="secondary" className="flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {hotel?.rating}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {hotel?.location}
                  </p>
                  {/* <p className="text-sm mb-4">From $199 per night</p> */}
                  <Button className="w-full">Book Now</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
