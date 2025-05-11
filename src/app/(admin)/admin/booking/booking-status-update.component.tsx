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
import { FcApproval } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios"; // Import AxiosError type

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
      return await privateRequest.put(`/bookings/status/${id}`, values);
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
        <div className="flex items-center gap-2 cursor-pointer">
          <FcApproval /> <span>Status</span>
        </div>
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
            <p className="text-sm text-red-500">
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
