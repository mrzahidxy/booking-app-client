"use client";

import { Form, useFormikContext } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import FormikPaginatedDropdown from "@/components/common/form/formik-paginatedDropdown.component";
import { FormikSubmitButton } from "@/components/common/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenantMemberFormValues } from "./form.config";

export const TenantMemberForm = ({
  disableUser,
  excludeUserIds = [],
}: {
  disableUser: boolean;
  excludeUserIds?: number[];
}) => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<TenantMemberFormValues>();

  const roleError = touched.role && errors.role ? String(errors.role) : null;

  return (
    <Form>
      <CardContent className="space-y-6">
        <div className={disableUser ? "pointer-events-none opacity-70" : ""}>
          <FormikPaginatedDropdown
            label="Select user"
            url="/users"
            formikField="userId"
            excludeIds={excludeUserIds}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tenant role</label>
          <Select
            value={values.role}
            onValueChange={(value) => setFieldValue("role", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tenant role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
            </SelectContent>
          </Select>
          {roleError ? <p className="text-xs text-red-500">{roleError}</p> : null}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <FormikSubmitButton text={disableUser ? "Update member" : "Add member"} />
      </CardFooter>
    </Form>
  );
};
