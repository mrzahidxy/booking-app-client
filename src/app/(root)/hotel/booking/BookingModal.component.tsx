"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { House, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { Form, Formik, FormikHelpers } from "formik";
import { toast } from "@/hooks/use-toast";
import { FormikCalendarField } from "@/components/form/formik-calender.component";
import { useSession } from "next-auth/react";
import { BookingCreate, InitialBookingValues } from "./form.config";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: number;
    roomType: string;
    price: number;
  };
}

export function BookingModal({ isOpen, onClose, room }: BookingModalProps) {
  const [step, setStep] = useState(1);

  // 🔹 Form Submission Mutation
  const mutation = useMutation({
    mutationFn: async (values: BookingCreate) =>
      privateRequest.post(`/hotels/book-room`, values),
  });

  const handleBooking = async (
    values: BookingCreate,
    { resetForm, setSubmitting }: FormikHelpers<BookingCreate>
  ) => {
    try {
      await mutation.mutateAsync({
        bookingDate: values.bookingDate,
        quantity: values.quantity,
        roomId: room.id,
      });

      toast({ title: "Success", description: `Room booked successfully!` });
      resetForm();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Book {room.roomType} Room</DialogTitle>
          <DialogDescription>
            Complete your booking details below
          </DialogDescription>
        </DialogHeader>

        <Formik initialValues={InitialBookingValues} onSubmit={handleBooking}>
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid gap-4">
                {step === 1 ? (
                  <>
                    {/* Date Picker Field */}
                    <FormikCalendarField
                      name="bookingDate"
                      inputFieldProps={{ label: "Select Booking Date" }}
                    />

                    {/* Guest Counter */}
                    <div className="grid gap-2">
                      <Label htmlFor="party-size">Number of Rooms</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setFieldValue(
                              "quantity",
                              Math.max(1, values.quantity! - 1)
                            )
                          }
                        >
                          -
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md">
                          <House className="h-4 w-4" />
                          <span>{values.quantity}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setFieldValue(
                              "quantity",
                              Math.min(4, values.quantity! + 1)
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!values.bookingDate}
                      className="w-full mt-2"
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Booking Summary */}
                    <div className="space-y-4">
                      <div className="grid gap-1">
                        <Label>Booking Summary</Label>
                        <div className="rounded-lg border p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Room Type
                            </span>
                            <span className="font-medium">{room.roomType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">
                              {values.bookingDate
                                ? format(new Date(values.bookingDate), "PPP")
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Guests
                            </span>
                            <span className="font-medium">
                              {values.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Price per night
                            </span>
                            <span className="font-medium">${room.price}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-semibold">Total</span>
                              <span className="font-semibold">
                                ${room.price * values.quantity!}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button className="flex-1" type="submit">
                        Confirm Booking
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
