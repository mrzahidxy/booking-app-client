"use client";

import { Formik } from "formik";
import { PermissionCreateUpdateForm } from "./permission-form.component";
import { InitialValues, PermissionCreate, PermissionSchema } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import queryClient from "@/app/config/queryClient";

export const PermissionCreateUpdate = ({
  permissionId,
  handelModal,
}: {
  permissionId: string;
  handelModal: () => void;
}) => {
  const fetchData = async (id: string) => {
    const response = await privateRequest.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/permissions/${id}`
    );
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["permission-list", permissionId],
    queryFn: () => fetchData(permissionId),
    enabled: +permissionId > 0,
  });


  // Display loading state
  if (isLoading) return <div>Loading...</div>;

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const handleSubmit = async (values: PermissionCreate) => {
    values?.id
      ? await privateRequest.put(`/role-permission/permissions/${values?.id}`, {
          name: values.name,
        })
      : await privateRequest.post("/role-permission/permissions", {
          name: values.name,
        });

    handelModal();
    queryClient.invalidateQueries({ queryKey: ["permissionsList"] });
  };

  return (
    <Formik
      initialValues={
        permissionId ? { name: data?.data?.name, id: data?.data?.id } : InitialValues
      }
      validationSchema={PermissionSchema}
      onSubmit={handleSubmit}
    >
      <PermissionCreateUpdateForm />
    </Formik>
  );
};
