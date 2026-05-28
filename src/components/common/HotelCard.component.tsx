import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import type { Hotel } from "@/entities/hotel";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const imageSrc = hotel?.image?.[0] ?? "/images/main-banner.jpg";

  return (
    <Link href={`/hotel/${hotel?.slug ?? hotel?.id}`} key={hotel?.name} className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
        <Image
          src={imageSrc}
          alt="Hotel"
          width={400}
          height={200}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />

        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h4 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-foreground">
                {hotel?.name}
            </h4>
            <Badge variant="success" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {hotel?.ratings ?? 0}
            </Badge>
          </div>
          <p className="mb-2 min-h-[3rem] flex-1 text-sm leading-6 text-muted-foreground">
            {hotel?.location}
          </p>

          <Button className="mt-4 w-full">Book Now</Button>
        </CardContent>
      </Card>
    </Link>
  );
}
