import { FormikCalendarField } from "@/components/common/form/formik-calender.component";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, useFormikContext } from "formik";
import { House, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BookingCreate } from "./form.config";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import PayButton from "@/components/common/PayButton.component";
import { checkRoomAvailability } from "@/features/hotels/api";

interface BookingFormProps {
  room: any;
  bookingId?: number;
}

export function BookingForm({ room, bookingId }: BookingFormProps) {
  const { values, setFieldValue, isSubmitting } =
    useFormikContext<BookingCreate>();
  const [step, setStep] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["availability", room.id, values.quantity, values.bookingDate],
    queryFn: () =>
      checkRoomAvailability({
        roomId: room.id,
        quantity: +values.quantity!,
        date: values.bookingDate,
      }),
    enabled: !!room.id && !!values.bookingDate,
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 20000,
  });

  const availabilityText = useMemo(() => {
    if (!values.bookingDate) {
      return "Select a date to check availability.";
    }
    if (isError) {
      return "Unable to check availability right now.";
    }
    if (isLoading) {
      return "Checking availability...";
    }
    if (typeof data?.availAbality === "number") {
      return `${data.availAbality} rooms available`;
    }
    return "Availability unavailable.";
  }, [data?.availAbality, isError, isLoading, values.bookingDate]);

  useEffect(() => {
    if (bookingId) {
      setStep(3);
    }
  }, [bookingId]);

  return (
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
                  aria-label="Decrease number of rooms"
                  onClick={() =>
                    setFieldValue("quantity", Math.max(1, values.quantity! - 1))
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
                  aria-label="Increase number of rooms"
                  onClick={() =>
                    setFieldValue("quantity", Math.min(4, values.quantity! + 1))
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div
              className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
              aria-live="polite"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking availability...
                </span>
              ) : (
                availabilityText
              )}
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={
                !values?.bookingDate ||
                isLoading ||
                isError ||
                (typeof data?.availAbality === "number" &&
                  data.availAbality < values.quantity!)
              }
              className="w-full mt-2"
            >
              Next
            </Button>
          </>
        ) : step === 2 ? (
          <>
            {/* Booking Summary */}
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label>Booking Summary</Label>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room Type</span>
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
                    <span className="text-muted-foreground">Rooms</span>
                    <span className="font-medium">{values.quantity}</span>
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
              <Button className="flex-1" type="submit" disabled={isSubmitting}>
                Confirm Booking
              </Button>
            </div>
          </>
        ) : (
          <PayButton bookingId={bookingId!} />
        )}
      </div>
    </Form>
  );
}
