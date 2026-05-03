import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SpecialOffers() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Limited perks
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">Special offers</h3>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Keep an eye on flexible booking windows, dining perks, and seasonal stay packages.
          </p>
        </div>

        <Card className="border-primary/10 bg-gradient-to-r from-primary/5 via-background to-secondary/10">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Curated booking perks
              </p>
              <h4 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Make every trip feel a little more elevated
              </h4>
              <p className="text-sm leading-6 text-muted-foreground">
                From breakfast-inclusive stays to chef-led dining experiences, Gontobbo keeps the
                best booking moments easy to find and easy to reserve.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Breakfast included", "Flexible cancellations", "Chef-led menus"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/#">Search stays</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/#">Search dining</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
