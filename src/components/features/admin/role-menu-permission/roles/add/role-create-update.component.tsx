"use client";

import { Formik, FormikHelpers } from "formik";
import { RoleCreateUpdateForm } from "./role-form.component";
import { InitialValues, RoleCreate, RoleSchema } from "./form.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { createRole, fetchRoleById, updateRole } from "@/features/role-permission/api";

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
    queryFn: () => fetchRoleById(roleId as number),
    enabled: !!roleId,
  });

  const roleMutation = useMutation({
    mutationFn: async (values: RoleCreate) => {
      return values.id
        ? updateRole(values.id, { name: values.name })
        : createRole({ name: values.name });
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
