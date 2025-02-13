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

// Define the options for status updates
const statusOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
];

interface StatusUpdateDialogProps {
  id: number;
}

interface UpdateRoleResponse {
  message: string;
  success: boolean;
}

interface UpdateRoleVariables {
  role: string;
}

interface ErrorResponse {
  message: string;
}


// Define the StatusUpdateDialog component
export const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("USER");
  const { toast } = useToast();

  const queryClient = useQueryClient();

  // Mutation for updating the user role
  const { mutate, isPending, isError, error } = useMutation<
    UpdateRoleResponse, // Expected response type
    AxiosError<ErrorResponse>,  // Error type with extended interface
    UpdateRoleVariables // Variables type
  >({
    mutationFn: async ({ role }) => {
      return await privateRequest.put(`/users/role/${id}`, { role });
    },
    onSuccess: () => {
      setIsOpen(false);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle the status update button click
  const handleStatusUpdate = () => {
    mutate({ role });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FcApproval />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Role</DialogTitle>
          <DialogDescription>
            Change the Role for item with ID: {id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
