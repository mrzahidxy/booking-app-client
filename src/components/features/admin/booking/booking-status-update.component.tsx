"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios"; // Import AxiosError type
import { updateBookingStatus } from "@/features/bookings/api";

interface StatusUpdateDialogProps {
  id: number;
  type: string;
}

interface UpdateStatusResponse {
  message: string;
  success: boolean;
}

interface UpdateStatusVariables {
  status: string;
  type: string;
}

interface ErrorResponse {
  message: string;
}

// BookingStatus enum
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// Define the StatusUpdateDialog component
export const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  id, type
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const { toast } = useToast();

  const queryClient = useQueryClient();

  // Mutation for updating the user role
  const { mutate, isPending, isError, error } = useMutation<
    UpdateStatusResponse, // Expected response type
    AxiosError<ErrorResponse>, // Error type with extended interface
    UpdateStatusVariables // Variables type
  >({
    mutationFn: async (values) => {
      return await updateBookingStatus(id, values);
    },
    onSuccess: () => {
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["bookingList"] });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to update role. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle the status update button click
  const handleStatusUpdate = () => {
    if (status === "") {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }
    mutate({status: status, type: type});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success transition hover:border-success/30 hover:bg-success/15"
        >
          <span className="h-2 w-2 rounded-full bg-success" />
          Status
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Status</DialogTitle>
          <DialogDescription>
            Change the status for Booking ID: {id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BookingStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {isError && (
            <p className="text-sm text-destructive">
              {error?.response?.data?.message || "Something went wrong."}
            </p>
          )}
          <Button onClick={handleStatusUpdate} disabled={isPending}>
            {isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
