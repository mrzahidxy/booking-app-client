import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function SpecialOffers() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8">Special Offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-2">Hotel Deal</h4>
              <p className="mb-4 text-primary-foreground/80">
                Get 20% off on your first hotel booking
              </p>
              <Button variant="secondary">Book Now</Button>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-2">Restaurant Offer</h4>
              <p className="mb-4 text-secondary-foreground/80">
                Free dessert with dinner reservations
              </p>
              <Button>Reserve Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
