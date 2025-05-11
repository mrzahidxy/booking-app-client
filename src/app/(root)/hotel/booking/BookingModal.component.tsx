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
import { House } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { Form, Formik, FormikHelpers } from "formik";
import { toast } from "@/hooks/use-toast";
import { FormikCalendarField } from "@/components/form/formik-calender.component";
import { BookingCreate, InitialBookingValues } from "./form.config";
import { BookingForm } from "./BookingForm.component";

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
          <BookingForm room={room} />
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
