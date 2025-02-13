"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { BookingModal } from "./BookingModal.component";

export default function HotelRooms({ rooms }: any) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  return (
    <>
      {rooms.map((room: any) => (
        <Card key={room.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{room.roomType} Room</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Free cancellation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Breakfast included
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${room.price}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>

            <Button className="w-full"
                  onClick={() => {
                    setSelectedRoom(room)
                    setIsBookingModalOpen(true)
                  }}
            >Select Room</Button>
          </CardContent>
        </Card>
      ))}

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
        />
      )}
    </>
  );
}
