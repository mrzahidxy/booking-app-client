"use client";

import { Formik, FormikHelpers } from "formik";
import { PermissionCreateUpdateForm } from "./permission-form.component";
import { InitialValues, PermissionCreate, PermissionSchema } from "./form.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import {
  createPermission,
  fetchPermissionById,
  updatePermission,
} from "@/features/role-permission/api";

export const PermissionCreateUpdate = ({
  permissionId = "",
  handelModal,
}: {
  permissionId?: string;
  handelModal: () => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["permission-details", permissionId],
    queryFn: () => fetchPermissionById(Number(permissionId)),
    staleTime: 0,
    enabled: !!permissionId,
  });

  const mutation = useMutation({
    mutationFn: async (values: PermissionCreate) => {
      return values?.id
        ? updatePermission(values.id, { name: values.name })
        : createPermission({ name: values.name });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permission saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["permissionsList"] });
      handelModal();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save permission",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (
    values: PermissionCreate,
    { setSubmitting, resetForm }: FormikHelpers<PermissionCreate>
  ) => {
    try {
      await mutation.mutateAsync(values);
      resetForm();
    } catch {
      // Errors handled in mutation
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <Formik
      initialValues={
        permissionId
          ? { name: data?.data?.name ?? "", id: data?.data?.id ?? undefined }
          : InitialValues
      }
      validationSchema={PermissionSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <PermissionCreateUpdateForm />
    </Formik>
  );
};
