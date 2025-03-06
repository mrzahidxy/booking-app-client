"use client";

import { Formik, FormikHelpers } from "formik";
import {
  AssignedRoleCreate,
  AssignedRoleSchema,
  InitialValues,
} from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AssignedRoleForm } from "./assigned-roles-form.component";

const fetchAssignedRolesById = async (id: string) => {
  if (!id) return null;
  const response = await privateRequest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/assigned-roles/${id}`
  );
  return response.data;
};

export const AssignedRolesCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch data using react-query
  const { data } = useQuery({
    queryKey: ["role-list", id],
    queryFn: () => fetchAssignedRolesById(id!),
    enabled: parseInt(id as string) > 0,
  });

  const submitRoleUpdate = useMutation({
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
      await submitRoleUpdate.mutateAsync(values);
      toast({
        title: "Success",
        description: "Role assigned successfully!",
      });
      resetForm();
      router.push("/admin/role-menu-permission/assigned-role");
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
              roleId: data?.data?.Role?.id,
              userId: data?.data?.id,
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
