import HeroSection from "./HeroSection.component";
import PopularHotels from "./PopularHotels.component";
import FeaturedRestaurants from "./FeaturedRestaurants.component";
import SpecialOffers from "./SpecialOffers.component";

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
