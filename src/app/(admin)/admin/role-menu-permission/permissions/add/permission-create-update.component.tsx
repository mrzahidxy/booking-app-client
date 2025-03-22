"use client";

import { Formik, FormikHelpers } from "formik";
import { PermissionCreateUpdateForm } from "./permission-form.component";
import { InitialValues, PermissionCreate, PermissionSchema } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
    queryFn: async () => {
      const response = await privateRequest.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/permissions/${permissionId}`
      );
      return response.data;
    },
    staleTime: 0,
    enabled: !!permissionId,
  });

  const mutation = useMutation({
    mutationFn: async (values: PermissionCreate) => {
      if (values?.id) {
        return await privateRequest.put(
          `/role-permission/permissions/${values.id}`,
          { name: values.name }
        );
      } else {
        return await privateRequest.post("/role-permission/permissions", {
          name: values.name,
        });
      }
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
