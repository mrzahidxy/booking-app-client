"use client";

import { Suspense, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";

import privateRequest from "@/shared/lib/api";
import { useToast } from "@/shared/hooks/use-toast";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormikPaginatedDropdown from "@/components/common/form/formik-paginatedDropdown.component";
import { FormikInputField, FormikSubmitButton } from "@/components/common/form";

type TenantRow = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
};

type StatusPayload = {
  id: number;
  isActive: boolean;
};

type CreateTenantOwnerValues = {
  userId: number | "";
  tenantName: string;
  tenantSlug: string;
};

const initialCreateTenantOwnerValues: CreateTenantOwnerValues = {
  userId: "",
  tenantName: "",
  tenantSlug: "",
};

const TenantsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, isActive }: StatusPayload) =>
      privateRequest.patch(`/admin/tenants/${id}/status`, { isActive }),
    onSuccess: (_response, variables) => {
      toast({
        title: "Success",
        description: variables.isActive
          ? "Tenant re-activated successfully."
          : "Tenant suspended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update tenant status.",
        variant: "destructive",
      });
    },
  });

  const createTenantOwnerMutation = useMutation({
    mutationFn: async (values: CreateTenantOwnerValues) =>
      privateRequest.post("/admin/owners", {
        userId: Number(values.userId),
        tenantName: values.tenantName.trim(),
        ...(values.tenantSlug.trim()
          ? { tenantSlug: values.tenantSlug.trim() }
          : {}),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tenant created and owner assigned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to create tenant and assign owner.",
        variant: "destructive",
      });
    },
  });

  const validateCreateTenantOwner = (
    values: CreateTenantOwnerValues
  ): FormikErrors<CreateTenantOwnerValues> => {
    const errors: FormikErrors<CreateTenantOwnerValues> = {};

    if (!values.userId) {
      errors.userId = "Owner user is required";
    }

    if (values.tenantName.trim().length < 3) {
      errors.tenantName = "Tenant name must be at least 3 characters";
    }

    if (
      values.tenantSlug.trim() &&
      values.tenantSlug.trim().length < 3
    ) {
      errors.tenantSlug = "Tenant slug must be at least 3 characters";
    }

    return errors;
  };

  const handleCreateTenantOwner = async (
    values: CreateTenantOwnerValues,
    { resetForm, setSubmitting }: FormikHelpers<CreateTenantOwnerValues>
  ) => {
    try {
      await createTenantOwnerMutation.mutateAsync(values);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (tenant: TenantRow) => {
    const nextStatus = !tenant.isActive;
    const action = nextStatus ? "reactivate" : "suspend";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${tenant.name}?`
    );

    if (!confirmed) {
      return;
    }

    mutate({ id: tenant.id, isActive: nextStatus });
  };

  const columns: ColumnDef<TenantRow>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "secondary" : "destructive"} className="rounded-full">
          {row.original.isActive ? "Active" : "Suspended"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const isActive = Boolean(row.original.isActive);
        return (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={isActive ? "destructive" : "secondary"}
              onClick={() => handleStatusChange(row.original)}
              disabled={isPending}
            >
              {isActive ? "Suspend" : "Re-activate"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <RequirePlatformAdmin>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicTable
          columns={columns}
          url="/admin/tenants"
          title="Tenants"
          description="View tenants, create owner workspaces, and manage tenant status."
          queryKey="admin-tenants"
          buttonText="Create Tenant"
          handleAdd={() => setIsCreateOpen(true)}
        />
      </Suspense>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create tenant</DialogTitle>
            <DialogDescription>
              Select an existing user and assign them as the owner of a new tenant.
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialCreateTenantOwnerValues}
            validate={validateCreateTenantOwner}
            onSubmit={handleCreateTenantOwner}
          >
            <Form className="space-y-4">
              <FormikPaginatedDropdown
                label="Owner user"
                url="/users"
                formikField="userId"
                disablePortal
              />
              <FormikInputField
                name="tenantName"
                inputFieldProps={{
                  label: "Tenant name",
                  placeholder: "Gontobbo Seaside",
                }}
              />
              <FormikInputField
                name="tenantSlug"
                inputFieldProps={{
                  label: "Tenant slug",
                  placeholder: "gontobbo-seaside",
                  helperText: "Optional. Leave blank to let the API generate it.",
                }}
              />
              <FormikSubmitButton text="Create tenant" />
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </RequirePlatformAdmin>
  );
};

export default TenantsPage;
