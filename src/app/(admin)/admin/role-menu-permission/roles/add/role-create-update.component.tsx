"use client";

import { Formik, FormikHelpers } from "formik";
import { RoleCreateUpdateForm } from "./role-form.component";
import { InitialValues, RoleCreate, RoleSchema } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const RoleCreateUpdate = ({
  roleId,
  onClose,
}: {
  roleId?: number | null;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["role-details", roleId],
    queryFn: async () => {
      const response = await privateRequest.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/roles/${roleId}`
      );
      return response.data;
    },
    enabled: !!roleId,
  });

  const roleMutation = useMutation({
    mutationFn: async (values: RoleCreate) => {
      return values.id
        ? privateRequest.put(`/role-permission/roles/${values.id}`, { name: values.name })
        : privateRequest.post("/role-permission/roles", { name: values.name });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Role saved successfully!" });
      queryClient.invalidateQueries({ queryKey: ["rolesList"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save role",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (
    values: RoleCreate,
    { setSubmitting, resetForm }: FormikHelpers<RoleCreate>
  ) => {
    try {
      await roleMutation.mutateAsync(values);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data: {error.message}</div>;

  return (
    <Formik
      initialValues={
        roleId
          ? { name: data?.data?.name || "", id: data?.data?.id }
          : InitialValues
      }
      validationSchema={RoleSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <RoleCreateUpdateForm />
    </Formik>
  );
};
