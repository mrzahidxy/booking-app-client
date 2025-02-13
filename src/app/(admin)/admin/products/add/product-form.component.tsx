import { Form } from "formik";

import { FormikUploadField } from "@/components/form/formik-file-upload.component";
import { FormikInputField, FormikSubmitButton } from "@/components/form";
// import { LoginCreateApiError } from "./form.config";

interface LoginFormProps {
  error?: any;
}

export function ProductForm({ error }: LoginFormProps) {
  return (
    <Form>
      <div className="space-y-4">
        <FormikInputField
          name="name"
          // apiError={error?.validationErrors?.username}
          inputFieldProps={{
            placeholder: "Product Name",
            inputClassName: "öutlined-none py-3",
          }}
        />
        <FormikInputField
          name="description"
          // apiError={error?.validationErrors?.password}
          inputFieldProps={{
            placeholder: "Description",
            inputClassName: "öutlined-none py-3",
            type: "textarea",
          }}
        />

        <FormikInputField
          name="price"
          // apiError={error?.validationErrors?.password}
          inputFieldProps={{
            placeholder: "Price",
            inputClassName: "öutlined-none py-3",
          }}
        />

        <FormikUploadField name="image" />

        <div className=" mt-3">
          <FormikSubmitButton
            className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
            text="Submit"
          />
        </div>
      </div>
    </Form>
  );
}
