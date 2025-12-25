import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { Form } from "formik";


// import { SignInApiError } from "./form.config";

interface SignInormProps {
  error?: any;
}

export function SignUpForm({ error }: SignInormProps) {
  return (
    <Form>
      <div className="flex flex-col gap-4">
        <FormikInputField
          name="name"
          // apiError={error?.validationErrors?.username}
          inputFieldProps={{
            label: "Full name",
            placeholder: "Jane Doe",
            inputClassName:
              "h-12 text-base bg-white/90 focus-visible:ring-2 focus-visible:ring-primary",
          }}
        />
        <FormikInputField
          name="email"
          // apiError={error?.validationErrors?.username}
          inputFieldProps={{
            label: "Email",
            placeholder: "you@example.com",
            inputClassName:
              "h-12 text-base bg-white/90 focus-visible:ring-2 focus-visible:ring-primary",
          }}
        />
        <FormikInputField
          name="password"
          // apiError={error?.validationErrors?.password}
          inputFieldProps={{
            label: "Password",
            placeholder: "Create a password",
            type: "password",
            inputClassName:
              "h-12 text-base bg-white/90 focus-visible:ring-2 focus-visible:ring-primary",
          }}
        />
        <div className="w-full mx-auto mt-3">
          <FormikSubmitButton
            className="w-full h-12 text-base font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
            text="Create account"
          />
        </div>
      </div>
    </Form>
  );
}
