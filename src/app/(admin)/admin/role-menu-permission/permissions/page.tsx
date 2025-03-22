"use client";

import { useState, Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TableActionButtons from "@/components/common/table-actions.component";
import { PermissionCreateUpdate } from "./add/permission-create-update.component";
import privateRequest from "@/healper/privateRequest";
import { useToast } from "@/hooks/use-toast";

const PermissionPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setSelectedPermissionId(id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedPermissionId(null);
    setIsDialogOpen(true);
  };

  const closeModal = () => {
    setSelectedPermissionId(null);
    setIsDialogOpen(false);
  };

  const { mutate: deletePermission, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) =>
      privateRequest.delete(`/role-permission/permissions/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permission deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["permissionsList"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete permission",
        variant: "destructive",
      });
    },
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          showView={false}
          onEdit={() => handleEdit(row.original.id)}
          onDelete={() => deletePermission(row.original.id)}
          loading={isDeleting}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/role-permission/permissions"
        title="Permissions"
        queryKey="permissionsList"
        buttonText="Add Permission"
        handleAdd={handleAdd}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-8">
          <DialogHeader>
            <DialogTitle>
              {selectedPermissionId ? "Edit Permission" : "Add Permission"}
            </DialogTitle>
            <DialogDescription>
              <PermissionCreateUpdate
                permissionId={selectedPermissionId ? String(selectedPermissionId) : ""}
                handelModal={closeModal}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
};

export default PermissionPage;
