"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Hotel } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { HotelCreateUpdate } from "@/components/features/workspace/organisation/hotels/add/hotels-create-update.component";
import { RestaurantCreateUpdate } from "@/components/features/workspace/organisation/restaurants/add/restuarant-create-update.component";
import { RequireWorkspace } from "@/components/features/workspace/RequireWorkspace";
import { fetchWorkspaceOrganisation } from "@/features/workspace/organisation-api";

type OrganisationRecord = {
  id: number;
  name?: string;
};

type CreateMode = "hotel" | "restaurant" | null;

function WorkspaceOrganisationContent() {
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tenant-organisation"],
    queryFn: fetchWorkspaceOrganisation,
    staleTime: 0,
    refetchOnMount: true,
  });

  const hotel = data?.hotel as OrganisationRecord | null;
  const restaurant = data?.restaurant as OrganisationRecord | null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Organisation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your tenant organisation...
          </p>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Unable to load the tenant organisation.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Organisation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the tenant&apos;s hotel or restaurant details in one place.
        </p>
      </div>

      {hotel ? (
        <HotelCreateUpdate id={String(hotel.id)} />
      ) : restaurant ? (
        <RestaurantCreateUpdate id={String(restaurant.id)} />
      ) : createMode === "hotel" ? (
        <HotelCreateUpdate />
      ) : createMode === "restaurant" ? (
        <RestaurantCreateUpdate />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 py-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Hotel className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create hotel</h2>
                  <p className="text-sm text-muted-foreground">
                    Set up your hotel listing, rooms, pricing, and amenities.
                  </p>
                </div>
              </div>
              <Button onClick={() => setCreateMode("hotel")}>Start hotel setup</Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="space-y-4 py-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-action/10 p-3 text-action">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create restaurant</h2>
                  <p className="text-sm text-muted-foreground">
                    Set up your restaurant listing, seats, menu, and service times.
                  </p>
                </div>
              </div>
              <Button variant="action" onClick={() => setCreateMode("restaurant")}>
                Start restaurant setup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function WorkspaceOrganisationPage() {
  return (
    <RequireWorkspace>
      <WorkspaceOrganisationContent />
    </RequireWorkspace>
  );
}
