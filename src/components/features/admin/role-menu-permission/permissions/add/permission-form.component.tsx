import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { Form } from "formik";

interface PermissionFormProps {
  error?: any;
}

export function PermissionCreateUpdateForm({ error }: PermissionFormProps) {
  return (
    <Form className="space-y-4">
      <FormikInputField
        name="name"
        // apiError={error?.validationErrors?.username}
        inputFieldProps={{
          placeholder: "Permission Name",
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
