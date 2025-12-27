import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HeroSection from "@/components/features/home/HeroSection.component";
import HomeSectionSkeleton from "@/components/features/home/HomeSectionSkeleton.component";

const PopularHotels = dynamic(
  () => import("@/components/features/home/PopularHotels.component"),
  {
    loading: () => <HomeSectionSkeleton title="Popular Hotels" />,
  }
);
const FeaturedRestaurants = dynamic(
  () => import("@/components/features/home/FeaturedRestaurants.component"),
  {
    loading: () => (
      <HomeSectionSkeleton
        title="Featured Restaurants"
        className="bg-secondary/10"
      />
    ),
  }
);
const SpecialOffers = dynamic(
  () => import("@/components/features/home/SpecialOffers.component"),
  {
    loading: () => <HomeSectionSkeleton title="Special Offers" items={2} />,
  }
);

export const metadata: Metadata = {
  title: "Traveller | Book Hotels & Restaurants",
  description:
    "Discover curated hotels and restaurants worldwide. Book stays, reserve tables, and explore travel offers with Traveller.",
  openGraph: {
    title: "Traveller | Book Hotels & Restaurants",
    description:
      "Discover curated hotels and restaurants worldwide. Book stays, reserve tables, and explore travel offers with Traveller.",
    images: ["/images/main-banner.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traveller | Book Hotels & Restaurants",
    description:
      "Discover curated hotels and restaurants worldwide. Book stays, reserve tables, and explore travel offers with Traveller.",
    images: ["/images/main-banner.jpg"],
  },
};

const HomePage = () => {
  return (
    <div className="container">
      <div className="min-h-screen bg-background">
        <HeroSection />
        <PopularHotels />
        <FeaturedRestaurants />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default HomePage;
