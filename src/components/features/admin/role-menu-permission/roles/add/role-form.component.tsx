import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { Form } from "formik";

interface RoleFormProps {
  error?: any;
}

export function RoleCreateUpdateForm({ error }: RoleFormProps) {
  return (
    <Form className="space-y-4">
      <FormikInputField
        name="name"
        // apiError={error?.validationErrors?.username}
        inputFieldProps={{
          placeholder: "Role Name",
          inputClassName: "öutlined-none py-3",
        }}
      />

      <div className=" mt-3">
        <FormikSubmitButton
          className="w-full rounded-xl bg-primary py-3 text-white transition-colors hover:bg-primary/90"
          text="Submit"
        />
      </div>
    </Form>
  );
}
