"use client";

import { Formik } from "formik";
import { RoleCreateUpdateForm } from "./role-form.component";
import { InitialValues, RoleCreate, RoleSchema } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import queryClient from "@/app/config/queryClient";

export const RoleCreateUpdate = ({
  roleId,
  handelModal,
}: {
  roleId: string;
  handelModal: () => void;
}) => {
  const fetchData = async (id: string) => {
    const response = await privateRequest.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/roles/${id}`
    );
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["role-list", roleId],
    queryFn: () => fetchData(roleId),
    enabled: +roleId > 0,
  });

  // Display loading state
  if (isLoading) return <div>Loading...</div>;

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const handleSubmit = async (values: RoleCreate) => {
    values?.id
      ? await privateRequest.put(`/role-permission/roles/${values?.id}`, {
          name: values.name,
        })
      : await privateRequest.post("/role-permission/roles", {
          name: values.name,
        });

    handelModal();
    queryClient.invalidateQueries({ queryKey: ["rolesList"] });
  };

  return (
    <Formik
      initialValues={
        roleId ? { name: data?.data?.name, id: data?.data?.id } : InitialValues
      }
      validationSchema={RoleSchema}
      onSubmit={handleSubmit}
    >
      <RoleCreateUpdateForm />
    </Formik>
  );
};
