"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { InitialValue, SignInRequest, SignInSchema } from "./form.config";
import { SignUpForm } from "./signup.form.component";
import { publicRequest } from "@/healper/privateRequest";
import { AppTitle } from "@/healper/common-string";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (values: SignInRequest) => {
    try {
      const response = await publicRequest.post("/auth/signup", values);
      if (response.status === 201) {
        router.push("/auth/login");
      }
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/images/main-banner.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Form Container */}
      <Card className="z-10 w-[400px] rounded-md px-4 py-8 backdrop-blur-md">
        <CardHeader className="text-bold text-3xl">
          <span>{AppTitle}</span>
          <span>Welcome.</span>
        </CardHeader>
        <CardDescription>
          {error && (
            <div className="text-center mb-4">
              <span className="font-semibold text-red-600 text-sm">
                {error}
              </span>
            </div>
          )}
        </CardDescription>
        <CardContent>
          <Formik
            initialValues={InitialValue}
            validationSchema={SignInSchema}
            onSubmit={handleSignupSubmit}
          >
            <SignUpForm />
          </Formik>
        </CardContent>
        <CardFooter className="text-xs  text-gray-600">
          <div>Already a member?</div>
          <div className="space-x-2">
            <Link
              href={"/auth/login"}
              className="font-semibold text-violet-700 underline"
            >
              Log In
            </Link>
            <span>to explore the best of Traveller.</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
