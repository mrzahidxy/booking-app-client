"use client";

import { Formik, FormikHelpers } from "formik";
import { AssignedRoleCreate, AssignedRoleSchema, InitialValues } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AssignedRoleForm } from "./assigned-roles-form.component";

const fetchAssignedRoleById = async (id: string) => {
  const response = await privateRequest.get(`/role-permission/assigned-roles/${id}`);
  return response.data;
};

export const AssignedRolesCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["assigned-role-details", id],
    queryFn: () => fetchAssignedRoleById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async (values: AssignedRoleCreate) => {
      return await privateRequest.post(
        `/role-permission/assigned-roles/${values.userId}`,
        { roleId: values.roleId }
      );
    },
  });

  const handleSubmit = async (
    values: AssignedRoleCreate,
    { resetForm, setSubmitting }: FormikHelpers<AssignedRoleCreate>
  ) => {
    try {
      await mutation.mutateAsync(values);
      toast({ title: "Success", description: "Role assigned successfully!" });
      resetForm();
      router.push("/admin/role-menu-permission/assigned-roles");
      queryClient.invalidateQueries({ queryKey: ["assigned-roles-list"] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={
        id
          ? {
              roleId: data?.data?.Role?.id ?? 0,
              userId: data?.data?.id ?? 0,
            }
          : InitialValues
      }
      validationSchema={AssignedRoleSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <AssignedRoleForm />
      </Card>
    </Formik>
  );
};
