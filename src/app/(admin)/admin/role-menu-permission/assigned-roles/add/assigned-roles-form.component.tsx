"use client";

import { Form } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import FormikPaginatedDropdown from "@/components/form/formik-paginatedDropdown.component";
import { FormikSubmitButton } from "@/components/form";

export const AssignedRoleForm = () => {
  return (
    <Form>
      <CardContent className="space-y-6">
        <FormikPaginatedDropdown label="Select User" url="/users" formikField="userId" />
        <FormikPaginatedDropdown label="Select Role" url="/role-permission/roles" formikField="roleId" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Assign Role" />
      </CardFooter>
    </Form>
  );
};
