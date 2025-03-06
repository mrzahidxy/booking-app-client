"use client";

import { Form } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import FormikPaginatedDropdown from "@/components/common/Formik-PaginatedDropdown";

import { FormikSubmitButton } from "@/components/form";


export const AssignedRoleForm = ({ id }: { id?: string }) => {

  return (
    <Form>
      <CardContent className="space-y-6">
        {/* Role Selector with Pagination */}
        <FormikPaginatedDropdown
          label="Select User"
          url="/users"
          formikField="userId"
        />

        <FormikPaginatedDropdown
          label="Select Role"
          url="/role-permission/roles"
          formikField="roleId"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Assign Permissions" />
      </CardFooter>
    </Form>
  );
};
