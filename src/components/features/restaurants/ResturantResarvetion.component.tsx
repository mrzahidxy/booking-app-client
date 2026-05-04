"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, type UseMutationResult } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "@/shared/hooks/use-toast";
import { Form, Formik, useFormikContext } from "formik";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import {
  checkRestaurantAvailability,
  createRestaurantReservation,
} from "@/features/restaurants/api";
import PayButton from "@/components/common/PayButton.component";

const TIME_SLOTS = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"];

const ReservationSchema = yup.object({
  partySize: yup.number().min(1).max(6).required(),
  bookingDate: yup.string().required("Booking date is required"),
  timeSlot: yup.string().required("Time slot is required"),
});

type ReservationValues = yup.InferType<typeof ReservationSchema>;

type ReservationFormProps = {
  restaurantId: number;
  status: string;
  mutation: UseMutationResult<unknown, unknown, ReservationValues, unknown>;
  reservationId: number | null;
  onEditReservation: () => void;
};

function ReservationForm({
  restaurantId,
  status,
  mutation,
  reservationId,
  onEditReservation,
}: ReservationFormProps) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<ReservationValues>();
  const availabilityParams = useMemo(
    () => ({
      restaurantId,
      partySize: values.partySize,
      date: values.bookingDate,
      timeSlot: values.timeSlot,
    }),
    [restaurantId, values.bookingDate, values.partySize, values.timeSlot]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "availability",
      availabilityParams.restaurantId,
      availabilityParams.partySize,
      availabilityParams.date,
      availabilityParams.timeSlot,
    ],
    queryFn: () => checkRestaurantAvailability(availabilityParams),
    enabled: !!restaurantId && !!values.bookingDate && !reservationId,
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 200000,
  });

  const availabilityText = useMemo(() => {
    if (!values.bookingDate) {
      return "Select a date to check availability.";
    }
    if (isLoading) {
      return "Checking availability...";
    }
    if (isError) {
      return "Unable to check availability right now.";
    }
    return `${data?.availAbality ?? 0} seat(s) available`;
  }, [data?.availAbality, isError, isLoading, values.bookingDate]);

  if (reservationId) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-emerald-50/80 p-4">
          <p className="text-sm font-medium text-emerald-700">Reservation created</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Proceed to payment to complete your restaurant reservation.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reservation ID</span>
            <span className="font-medium">#{reservationId}</span>
          </div>
          <PayButton bookingId={reservationId} />
          <Button type="button" variant="outline" className="w-full" onClick={onEditReservation}>
            Edit reservation
          </Button>
        </div>
      </div>
    );
  }

  const isDisabled =
    status === "unauthenticated" || mutation.isPending || !data?.isAvailable;

  return (
    <Form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="party-size">Party Size</Label>
        <Select
          value={String(values.partySize)}
          onValueChange={(value) => setFieldValue("partySize", Number(value))}
        >
          <SelectTrigger id="party-size">
            <SelectValue placeholder="Select party size" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} {size === 1 ? "person" : "people"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.partySize && errors.partySize ? (
          <p className="text-xs text-destructive">{errors.partySize}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          className="h-11"
          value={values.bookingDate}
          onChange={(event) => setFieldValue("bookingDate", event.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
        {touched.bookingDate && errors.bookingDate ? (
          <p className="text-xs text-destructive">{errors.bookingDate}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Select
          value={values.timeSlot}
          onValueChange={(value) => setFieldValue("timeSlot", value)}
        >
          <SelectTrigger id="time">
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            {TIME_SLOTS.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.timeSlot && errors.timeSlot ? (
          <p className="text-xs text-destructive">{errors.timeSlot}</p>
        ) : null}
      </div>

      <div
        className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
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
        variant="action"
        className="w-full"
        disabled={isDisabled}
        type="submit"
      >
        {status === "unauthenticated" ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Sign in to reserve
          </>
        ) : mutation.isPending ? (
          "Processing..."
        ) : (
          "Reserve a Table"
        )}
      </Button>
    </Form>
  );
}

export default function RestaurantResarvetion({ restaurantData }: any) {
  const { status } = useSession();
  const [reservationId, setReservationId] = useState<number | null>(null);

  const initialValues: ReservationValues = {
    partySize: 1,
    timeSlot: TIME_SLOTS[0],
    bookingDate: new Date().toISOString().split("T")[0],
  };

  const mutation = useMutation({
    mutationFn: async (values: ReservationValues) =>
      createRestaurantReservation({
        restaurantId: restaurantData.id,
        partySize: values.partySize,
        bookingDate: values.bookingDate,
        timeSlot: values.timeSlot,
      }),
    onSuccess: (response: any) => {
      setReservationId(response.data.data.id);
      toast({
        title: "Success",
        description: `Restaurant reservation created. Continue to payment.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.userMessage ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>Make a Reservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-slate-50/80 px-3 py-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <span>Open Now</span>
            </div>
            <span className="text-xs font-medium text-success">Accepting reservations</span>
          </div>
          <Separator />
          <Formik
            initialValues={initialValues}
            validationSchema={ReservationSchema}
            onSubmit={(values, { resetForm }) => {
              mutation.mutate(values, {
                onSuccess: () => resetForm({ values: initialValues }),
              });
            }}
            validateOnBlur
            validateOnChange
          >
            <ReservationForm
              restaurantId={restaurantData.id}
              status={status}
              mutation={mutation}
              reservationId={reservationId}
              onEditReservation={() => setReservationId(null)}
            />
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
