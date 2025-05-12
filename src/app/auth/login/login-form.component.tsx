import { FormikInputField, FormikSubmitButton } from "@/components/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "formik";
import Link from "next/link";

export function LogInForm() {
  return (
    <div className="w-full">
   
        <Form>
          <div className="flex flex-col gap-1">
            <FormikInputField
              name="email"
              inputFieldProps={{
                placeholder: "Enter user Email",
                inputClassName: "öutlined-none py-3",
              }}
            />
            <FormikInputField
              name="password"
              inputFieldProps={{
                placeholder: "Enter password",
                inputClassName: "öutlined-none py-3",
              }}
            />

            <div className="w-full mx-auto mt-3">
              <FormikSubmitButton
                className="bg-blue-500 hover:bg-blue-600 transition  delay-100 ease-in-out text-white w-full py-3 rounded-md"
                text="Login"
              />
            </div>
          </div>
        </Form>
    
    </div>
  );
}
