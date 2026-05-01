"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/shared/lib/api";
import { Formik, FormikHelpers } from "formik";
import { toast } from "@/shared/hooks/use-toast";
import { BookingCreate, BookingSchema, InitialBookingValues } from "./form.config";
import { BookingForm } from "./BookingForm.component";
import { useState } from "react";

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
  const [bookingId, setBookingId] = useState<number | null>(null);

  // 🔹 Form Submission Mutation
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
        roomId: room.id,
      });

      setBookingId(response.data.id);

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

        <Formik
          initialValues={InitialBookingValues}
          validationSchema={BookingSchema}
          onSubmit={handleBooking}
          validateOnBlur
          validateOnChange
        >
          <BookingForm room={room} bookingId={bookingId!} />
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
