import HotelCard from "@/components/common/HotelCard.component";
import axios from "axios";


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 justify-center gap-6">
          {hotels?.collection?.map((hotel: any) => (
            <HotelCard key={hotel?.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
}
