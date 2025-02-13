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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
        <span>zahid@example.com; Pass12344</span>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          <Link
            href="/forgot-password"
            className="text-violet-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="text-sm text-center">
          Not a member?{" "}
          <Link
            href="/auth/signup"
            className="text-violet-600 hover:underline font-semibold"
          >
            Join
          </Link>{" "}
          to unlock the best of products.
        </div>
      </CardFooter>
    </Card>
  );
}
