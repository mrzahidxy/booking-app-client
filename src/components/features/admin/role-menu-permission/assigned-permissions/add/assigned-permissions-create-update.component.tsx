"use client";

import { Formik, FormikHelpers } from "formik";
import {
  AssignedPermissionCreate,
  AssignedPermissionSchema,
  InitialValues,
} from "./form.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { AssignedPermissionsForm } from "./assigned-permissions-form.component";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { TRolePermissionsByIdResponse } from "@/entities/role-permission";
import {
  assignPermissionsToRole,
  fetchPermissionsForRole,
  replacePermissionsForRole,
} from "@/features/role-permission/api";

export const AssignedPermissionsCreateUpdate = ({
  id = "",
}: {
  id?: string;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const roleId = Number(id);
  const isEditing = Number.isFinite(roleId) && roleId > 0;

  // Fetch data on update
  const { data, isLoading, isError, error } = useQuery<TRolePermissionsByIdResponse>({
    queryKey: ["assigned-permission-details", id],
    queryFn: () => fetchPermissionsForRole(roleId),
    enabled: isEditing,
  });

  // Handle form submission on create/update
  const mutation = useMutation({
    mutationFn: async (values: AssignedPermissionCreate) => {
      const payload = {
        roleId: values.roleId,
        permissionIds: values.permissionIds.filter(id => id !== undefined) as number[],
      };
      return isEditing
        ? replacePermissionsForRole(payload)
        : assignPermissionsToRole(payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permissions assigned successfully!",
      });
      router.push("/admin/role-menu-permission/assigned-permissions");
      queryClient.invalidateQueries({
        queryKey: ["assigned-permissions-list"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to assign permissions",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (
    values: AssignedPermissionCreate,
    { setSubmitting, resetForm }: FormikHelpers<AssignedPermissionCreate>
  ) => {
    try {
      await mutation.mutateAsync(values);
      resetForm();
    } catch {
      // Error handled in onError
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <Formik
      initialValues={
        id
          ? {
            roleId: data?.data?.roleId,
            permissionIds: data?.data?.permissionIds,
          } as AssignedPermissionCreate
          : InitialValues
      }
      validationSchema={AssignedPermissionSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <AssignedPermissionsForm />
      </Card>
    </Formik>
  );
};
