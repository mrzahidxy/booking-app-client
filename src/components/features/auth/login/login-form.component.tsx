import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { Form } from "formik";

export function LogInForm() {
  return (
    <div className="w-full">
      <Form>
        <div className="flex flex-col gap-4">
          <FormikInputField
            name="email"
            inputFieldProps={{
              label: "Email",
              placeholder: "you@example.com",
              inputClassName:
                "h-12 text-base bg-white/90 focus-visible:ring-2 focus-visible:ring-primary",
            }}
          />
          <FormikInputField
            name="password"
            inputFieldProps={{
              label: "Password",
              placeholder: "Enter your password",
              type: "password",
              inputClassName:
                "h-12 text-base bg-white/90 focus-visible:ring-2 focus-visible:ring-primary",
            }}
          />

          <div className="w-full mx-auto mt-2">
            <FormikSubmitButton
              className="w-full h-12 text-base font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-0.5"
              text="Log in"
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
