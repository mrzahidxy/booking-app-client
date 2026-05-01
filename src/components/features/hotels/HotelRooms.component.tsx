"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Lock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookingCreate,
  BookingSchema,
  InitialBookingValues,
} from "./booking/form.config";
import { Formik, FormikHelpers } from "formik";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/shared/lib/api";
import { toast } from "@/shared/hooks/use-toast";
import { BookingForm } from "./booking/BookingForm.component";
import { useSession } from "next-auth/react";

export default function HotelRooms({ rooms }: any) {
  const {status} = useSession();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // booking room creation
  const mutation = useMutation({
    mutationFn: async (values: BookingCreate) =>
      privateRequest.post(`/bookings/room`, values),
  });

  const handleBooking = async (
    values: BookingCreate,
    { resetForm, setSubmitting }: FormikHelpers<BookingCreate>
  ) => {
    try {
      const response = await mutation.mutateAsync({
        bookingDate: values.bookingDate,
        quantity: values.quantity,
        roomId: selectedRoom.id,
      });

      setBookingId(response.data.data.id);

      toast({ title: "Success", description: `Room booked successfully!` });
      resetForm();
      // setOpen(false);
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


  if (!rooms?.length) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No rooms available for this hotel yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {rooms.map((room: any) => (
          <Card key={room.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-semibold">${room.price}</p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={status === "unauthenticated"}
                onClick={() => {
                  setSelectedRoom(room);
                  setOpen(true);
                }}
              >
                {status === "unauthenticated" ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign in to book
                  </>
                ) : (
                  "Select Room"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[380px]">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom.roomType} Room</DialogTitle>
              <DialogDescription>
                Complete your booking details below
              </DialogDescription>
            </DialogHeader>
            <Formik
              initialValues={InitialBookingValues}
              validationSchema={BookingSchema}
              onSubmit={handleBooking}
              validateOnBlur
              validateOnChange
            >
              <BookingForm room={selectedRoom} bookingId={bookingId ?? undefined} />
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
