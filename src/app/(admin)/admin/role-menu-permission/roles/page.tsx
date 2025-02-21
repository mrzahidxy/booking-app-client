"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleCreateUpdate } from "./add/role-create-update.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import queryClient from "@/app/config/queryClient";

const RolePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setSelectedRoleId(id);
    setIsDialogOpen(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return await privateRequest.delete(`/role-permission/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolesList"] });
    },
  });

  const handleDelete = async (id: number) => {
    mutate(id);
  };

  // Table columns
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
          onEdit={(id) => handleEdit(+id)}
          onDelete={(id) => handleDelete(+id)}
          loading={isPending}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/role-permission/roles"
        title="Roles"
        queryKey="rolesList"
        buttonText="Add Role"
        handleAdd={() => setIsDialogOpen(true)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-8">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              <RoleCreateUpdate
                roleId={String(selectedRoleId)}
                handelModal={() => {
                  setSelectedRoleId(null);
                  setIsDialogOpen(false);
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Suspense>
  );
};

export default RolePage;
