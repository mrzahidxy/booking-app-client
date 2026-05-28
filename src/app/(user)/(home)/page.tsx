import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/features/home/HeroSection.component";
import HomeSectionSkeleton from "@/components/features/home/HomeSectionSkeleton.component";

const PopularHotels = dynamic(
  () => import("@/components/features/home/PopularHotels.component"),
  {
    loading: () => <HomeSectionSkeleton title="Popular stays" />,
  }
);
const FeaturedRestaurants = dynamic(
  () => import("@/components/features/home/FeaturedRestaurants.component"),
  {
    loading: () => (
      <HomeSectionSkeleton
        title="Featured restaurants"
        className="bg-secondary/10"
      />
    ),
  }
);
const SpecialOffers = dynamic(
  () => import("@/components/features/home/SpecialOffers.component"),
  {
    loading: () => <HomeSectionSkeleton title="Special offers" items={2} />,
  }
);

export const metadata: Metadata = {
  title: "Gontobbo | Stay, Dine & Book",
  description:
    "Book polished hotel stays and restaurant tables with Gontobbo. Discover curated places, browse featured picks, and reserve with confidence.",
  openGraph: {
    title: "Gontobbo | Stay, Dine & Book",
    description:
      "Book polished hotel stays and restaurant tables with Gontobbo. Discover curated places, browse featured picks, and reserve with confidence.",
    images: ["/images/main-banner.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gontobbo | Stay, Dine & Book",
    description:
      "Book polished hotel stays and restaurant tables with Gontobbo. Discover curated places, browse featured picks, and reserve with confidence.",
    images: ["/images/main-banner.jpg"],
  },
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <PopularHotels />
      <SpecialOffers />
      <FeaturedRestaurants />
    </div>
  );
};

export default HomePage;
