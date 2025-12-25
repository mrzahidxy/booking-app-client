import HeroSection from "@/components/features/home/HeroSection.component";
import PopularHotels from "@/components/features/home/PopularHotels.component";
import FeaturedRestaurants from "@/components/features/home/FeaturedRestaurants.component";
import SpecialOffers from "@/components/features/home/SpecialOffers.component";

export const revalidate = 10;  // rebuild page every 10s

const HomePage = () => {
  return (
    <div className="container">
      <div className="min-h-screen bg-background">
        <HeroSection />
        <PopularHotels/>
        <FeaturedRestaurants/>
        <SpecialOffers/>
      </div>
    </div>
  );
};

export default HomePage;
