"use client";

import { Formik } from "formik";
import { LogInForm } from "./login-form.component";
import { InitialValue, LoginCreate, LoginSchema } from "./form.config";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (values: LoginCreate) => {
    const res = await signIn("credentials", {
      redirect: false,
      ...values,
    });

    if (res?.error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/main-banner.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10  backdrop-blur-sm" />

      {/* Form Container */}
      <Card className="relative z-10 w-[400px] rounded-md px-4 py-8 backdrop-blur-md">
        {/* Form Container */}
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription className="flex flex-col gap-1 text-xs">
            <span>Enter your credentials to access your account</span>
            <span>user@example.com; password123</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={InitialValue}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            <LogInForm />
          </Formik>
        </CardContent>

        <CardFooter className="flex text-xs">
          <Link
            href="/forgot-password"
            className="flex-1 text-violet-600 hover:underline"
          >
            Forgot your password?
          </Link>

          <div className="flex-1">
            Not a member?{" "}
            <Link
              href="/auth/signup"
              className="text-violet-600 hover:underline font-semibold"
            >
              Join
            </Link>{" "}
            to unlock the best.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
