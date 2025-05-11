"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingCreate, InitialBookingValues } from "./booking/form.config";
import { Formik, FormikHelpers } from "formik";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { toast } from "@/hooks/use-toast";
import { BookingForm } from "./booking/BookingForm.component";

export default function HotelRooms({ rooms }: any) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async (values: BookingCreate) =>
      privateRequest.post(`/bookings/room`, values),
  });

  const handleBooking = async (
    values: BookingCreate,
    { resetForm, setSubmitting }: FormikHelpers<BookingCreate>
  ) => {
    try {
      await mutation.mutateAsync({
        bookingDate: values.bookingDate,
        quantity: values.quantity,
        roomId: selectedRoom.id,
      });

      toast({ title: "Success", description: `Room booked successfully!` });
      resetForm();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      {rooms.map((room: any) => (
        <Card key={room.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{room.roomType} Room</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  {room.amenities.map((amenity: any) => (
                    <li key={amenity} className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${room.price}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setSelectedRoom(room);
                setOpen(true);
              }}
            >
              Select Room
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Booking Modal */}
      {selectedRoom && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom.roomType} Room</DialogTitle>
              <DialogDescription>
                Complete your booking details below
              </DialogDescription>
            </DialogHeader>
            <Formik
              initialValues={InitialBookingValues}
              onSubmit={handleBooking}
            >
              <BookingForm room={selectedRoom} />
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
