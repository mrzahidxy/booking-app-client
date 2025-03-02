"use client";

import { Formik } from "formik";
import {
  AssignedPermissionCreate,
  AssignedPermissionSchema,
  InitialValues,
} from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AssignedPermissionsForm } from "./assigned-permissions-form.component";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const fetchAssignedPermissionsById = async (id: string) => {
  if (!id) return null;
  const response = await privateRequest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/assigned-permissions/${id}`
  );
  return response.data;
};

export const AssignedPermissionsCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router  = useRouter();

  // Fetch data using react-query
  const { data } = useQuery({
    queryKey: ["role-list", id],
    queryFn: () => fetchAssignedPermissionsById(id!),
    enabled: parseInt(id as string) > 0,
  });

  // Mutation for submitting role updates
  const submitRoleUpdate = useMutation({
    mutationFn: async (values: AssignedPermissionCreate) => {
      return id
        ? await privateRequest.put(
            `/role-permission/assigned-permissions/edit`,
            {
              roleId: values.roleId,
              permissionIds: values.permissionIds,
            }
          )
        : await privateRequest.post("/role-permission//assigned-permissions/", {
            roleId: values.roleId,
            permissionIds: values.permissionIds,
          });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permissions assigned successfully!",
      });
      router.push("/admin/role-menu-permission/assigned-permissions");
      queryClient.invalidateQueries({ queryKey: ["assigned-permissions-list"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign permissions",
        variant: "destructive",
      });
    },
  });

  return (
    <Formik
      initialValues={
        id
          ? {
              id: data?.data?.id,
              roleId: data?.data?.roleId,
              permissionIds: data?.data?.permissionIds,
            }
          : InitialValues
      }
      validationSchema={AssignedPermissionSchema}
      onSubmit={submitRoleUpdate.mutate}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <AssignedPermissionsForm />
      </Card>
    </Formik>
  );
};
