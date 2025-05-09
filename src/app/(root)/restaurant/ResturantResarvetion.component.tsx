"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import privateRequest, { publicRequest } from "@/healper/privateRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import queryClient from "@/app/config/queryClient";
import { useRouter } from "next/navigation";

const TIME_SLOTS = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];

const fetchRestaurantAvailability = async ({
  restaurantId,
  partySize,
  date,
  timeSlot,
}: {
  restaurantId: string;
  partySize: number;
  date: string;
  timeSlot: string;
}) => {
  const response = await publicRequest.get("/restaurants/reservation/check", {
    params: { restaurantId, partySize, date, timeSlot },
  });
  return response.data.data;
};

export default function RestaurantResarvetion({ restaurantData }: any) {
  const router = useRouter();

  const [partySize, setPartySize] = useState(1);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["availability", restaurantData.id, partySize, date, timeSlot],
    queryFn: () =>
      fetchRestaurantAvailability({
        restaurantId: restaurantData.id,
        partySize,
        date,
        timeSlot,
      }),
    enabled: !!restaurantData.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 600000,
  });

  // Make a reservation
  const mutation = useMutation({
    mutationFn: async () =>
      privateRequest.post(`/restaurants/reservation`, {
        restaurantId: restaurantData.id,
        partySize: partySize,
        bookingDate: date,
        timeSlot: timeSlot,
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Restaurant reservation successfully!`,
      });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["restaurants-list"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Make a Reservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Open Now</span>
            </div>
            {/* <span className="text-sm text-muted-foreground">
              11:00 AM - 10:00 PM
            </span> */}
          </div>
          <Separator />
          <div className="space-y-2">
            <label htmlFor="party-size" className="text-sm font-medium">
              Party Size
            </label>
            <select
              id="party-size"
              onChange={(e) => setPartySize(parseInt(e.target.value))}
              value={partySize}
              className="w-full p-2 border rounded-md"
            >
              {[1, 2, 3, 4, 5, 6].map((size) => (
                <option key={size} value={size}>
                  {size} {size === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full p-2 border rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Time
            </label>
            <select
              id="time"
              onChange={(e) => setTimeSlot(e.target.value)}
              value={timeSlot}
              className="w-full p-2 border rounded-md"
            >
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            if (isLoading) {
              return <p>Loading...</p>;
            }
            if (isError) {
              return <p>Error fetching data.</p>;
            }
            return <p>{data.availAbality} seat(s) available</p>;
          })()}

          <Button
            className="w-full"
            disabled={!data?.isAvailable}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Processing..." : "Reserve a Table"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
