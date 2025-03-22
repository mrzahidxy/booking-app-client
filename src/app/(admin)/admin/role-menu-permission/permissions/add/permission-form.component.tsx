import { FormikInputField, FormikSubmitButton } from "@/components/form";
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
          className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
          text="Submit"
        />
      </div>
    </Form>
  );
}
