"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HotelImageGallery({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = images.length > 0;
  const currentImage = images[currentImageIndex] ?? "/images/main-banner.jpg";

  return (
    <>
      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden border bg-muted">
        {hasImages ? (
          <>
            <Image
              key={currentImage}
              src={currentImage}
              alt={`Hotel image ${currentImageIndex + 1} of ${images.length}`}
              width={1200}
              height={700}
              className="w-full aspect-video object-cover transition-opacity duration-300"
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-xs text-white/90">
              {currentImageIndex + 1} / {images.length}
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                disabled={images.length <= 1}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                disabled={images.length <= 1}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-video text-muted-foreground">
            <ImageOff className="h-10 w-10 mb-2" />
            <p className="text-sm">No images available</p>
          </div>
        )}
      </div>

      {/* Thumbnail Scroll */}
      {hasImages ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex gap-2 p-1">
            {images.map((image, index) => (
              <button
                key={image + index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 rounded-md overflow-hidden border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  currentImageIndex === index ? "ring-2 ring-primary" : ""
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image || "/images/main-banner.jpg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : null}
    </>
  );
}
