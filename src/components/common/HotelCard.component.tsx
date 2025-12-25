import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

export default function HotelCard({ hotel }: { hotel: any }) {
  const imageSrc = hotel?.image?.[0] ?? "/images/main-banner.jpg";

  return (
    <Link href={`/hotel/${hotel?.id}`} key={hotel?.name}>
      <Card className="overflow-hidden h-[400px] flex flex-col justify-between">
        <Image
          src={imageSrc}
          alt="Hotel"
          width={400}
          height={200}
          className="w-full h-[200px] object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />

        <CardContent className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-base line-clamp-1">
                {hotel?.name}
              </h4>
              <Badge variant="secondary" className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current" />
                {hotel?.rating ?? hotel?.ratings ?? 0}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {hotel?.location}
            </p>
          </div>

          <Button className="w-full mt-auto">Book Now</Button>
        </CardContent>
      </Card>
    </Link>
  );
}
