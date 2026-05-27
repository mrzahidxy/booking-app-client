"use client";

import { Form } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import FormikPaginatedDropdown from "@/components/common/form/formik-paginatedDropdown.component";
import { FormikSubmitButton } from "@/components/common/form";

export const AssignedRoleForm = () => {
  return (
    <Form>
      <CardContent className="space-y-6">
        <FormikPaginatedDropdown label="Select user" url="/users" formikField="userId" />
        <FormikPaginatedDropdown label="Select platform role" url="/role-permission/roles" formikField="roleId" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Assign platform role" />
      </CardFooter>
    </Form>
  );
};
