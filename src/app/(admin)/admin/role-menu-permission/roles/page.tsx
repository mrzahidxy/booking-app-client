"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleCreateUpdate } from "./add/role-create-update.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { useToast } from "@/hooks/use-toast";

const RolePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setSelectedRoleId(id);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRoleId(null);
    setIsDialogOpen(true);
  };

  const { mutate: deleteRole, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => privateRequest.delete(`/role-permission/roles/${id}`),
    onSuccess: () => {
      toast({ title: "Success", description: "Role deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["rolesList"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => deleteRole(id);

  const columns: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          showView={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isDeleting}
        />
      ),
    },
  ];

  const handleModalClose = () => {
    setSelectedRoleId(null);
    setIsDialogOpen(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/role-permission/roles"
        title="Roles"
        queryKey="rolesList"
        buttonText="Add Role"
        handleAdd={handleAdd}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-8">
          <DialogHeader>
            <DialogTitle>{selectedRoleId ? "Edit Role" : "Add Role"}</DialogTitle>
            <RoleCreateUpdate roleId={selectedRoleId} onClose={handleModalClose} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
};

export default RolePage;
