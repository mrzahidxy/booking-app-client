"use client";

import { Formik, FormikHelpers } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";
import {
  createTenantMember,
  fetchTenantMembers,
  updateTenantMemberRole,
} from "@/features/workspace/team-api";
import {
  InitialValues,
  TenantMemberFormValues,
  TenantMemberSchema,
} from "./form.config";
import { TenantMemberForm } from "./tenant-member-form.component";

export const TenantMemberCreateUpdate = ({
  tenantId,
  memberId,
}: {
  tenantId: number;
  memberId?: number;
}) => {
  const isEditing = Boolean(memberId);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tenant-members", tenantId],
    queryFn: () => fetchTenantMembers(tenantId),
    enabled: tenantId > 0,
  });

  const selectedMember = data?.data.collection.find((member) => member.id === memberId);

  const mutation = useMutation({
    mutationFn: async (values: TenantMemberFormValues) => {
      if (isEditing && memberId) {
        return updateTenantMemberRole(tenantId, memberId, { role: values.role });
      }

      return createTenantMember(tenantId, {
        userId: values.userId,
        role: values.role,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: isEditing
          ? "Tenant member updated successfully."
          : "Tenant member added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-members", tenantId] });
      router.push("/workspace/team");
    },
    onError: (mutationError: any) => {
      toast({
        title: "Error",
        description:
          mutationError?.response?.data?.message ||
          (isEditing
            ? "Failed to update tenant member."
            : "Failed to add tenant member."),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (
    values: TenantMemberFormValues,
    { setSubmitting }: FormikHelpers<TenantMemberFormValues>
  ) => {
    try {
      await mutation.mutateAsync(values);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data: {(error as Error).message}</div>;
  if (isEditing && !selectedMember) return <div>Tenant member not found.</div>;

  const existingUserIds = data?.data.collection.map((member) => member.userId) ?? [];

  return (
    <Formik
      initialValues={
        selectedMember
          ? {
              userId: selectedMember.userId,
              role: selectedMember.role,
            }
          : InitialValues
      }
      validationSchema={TenantMemberSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <TenantMemberForm
        disableUser={isEditing}
        excludeUserIds={isEditing ? [] : existingUserIds}
      />
    </Formik>
  );
};
