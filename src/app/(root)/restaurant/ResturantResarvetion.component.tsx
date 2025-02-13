"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function RestaurantResarvetion({ restaurantData }: any) {
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
            <span className="text-sm text-muted-foreground">
              11:00 AM - 10:00 PM
            </span>
          </div>
          <Separator />
          <div className="space-y-2">
            <label htmlFor="party-size" className="text-sm font-medium">
              Party Size
            </label>
            <select id="party-size" className="w-full p-2 border rounded-md">
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
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Time
            </label>
            <select id="time" className="w-full p-2 border rounded-md">
              {[
                "11:00 AM",
                "12:00 PM",
                "1:00 PM",
                "6:00 PM",
                "7:00 PM",
                "8:00 PM",
              ].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <Button className="w-full">Reserve a Table</Button>
        </CardContent>
      </Card>
    </div>
  );
}
