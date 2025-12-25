"use client";

import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { InitialValue, SignInRequest, SignInSchema } from "./form.config";
import { SignUpForm } from "./signup.form.component";
import { AppTitle } from "@/shared/utils/constants";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { signUp } from "@/features/auth/api";

export const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (values: SignInRequest) => {
    try {
      const response = await signUp(values);
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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage: `url('/images/main-banner.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65 backdrop-blur-[2px]" />

      {/* Form Container */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl border-white/10 bg-white/90 px-6 py-8 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-300">
        <CardHeader>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {AppTitle}
          </span>
          <span className="text-2xl font-semibold tracking-tight">
            Create your account
          </span>
          <CardDescription className="text-sm">
            Start booking stays and experiences in minutes.
          </CardDescription>
        </CardHeader>
        {error && (
          <div
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        <CardContent>
          <Formik
            initialValues={InitialValue}
            validationSchema={SignInSchema}
            onSubmit={handleSignupSubmit}
          >
            <SignUpForm />
          </Formik>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>Already a member?</div>
          <div className="space-x-2">
            <Link
              href={"/auth/login"}
              className="font-semibold text-primary hover:underline"
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
