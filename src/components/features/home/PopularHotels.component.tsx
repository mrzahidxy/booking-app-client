import HotelCard from "@/components/common/HotelCard.component";
import { fetchHotels } from "@/features/hotels/api";

export default async function PopularHotels() {
  let hotels = null;
  try {
    hotels = await fetchHotels();
  } catch (error) {
    console.error(error);
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Popular Hotels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 justify-center gap-6">
          {hotels?.collection?.slice(0, 5).map((hotel: any) => (
            <HotelCard key={hotel?.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
