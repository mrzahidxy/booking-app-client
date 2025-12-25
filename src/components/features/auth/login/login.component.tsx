"use client";

import { Formik } from "formik";
import { LogInForm } from "./login-form.component";
import { InitialValue, LoginCreate, LoginSchema } from "./form.config";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/shared/hooks/use-toast";
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
  const { status } = useSession();

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
  }, [status, router]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url('/images/main-banner.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 backdrop-blur-[2px]" />

      {/* Form Container */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl border-white/10 bg-white/90 px-6 py-8 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-300">
        {/* Form Container */}
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm">
            Sign in to manage bookings and reservations.
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

        <CardFooter className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 text-right">
            Not a member?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-semibold"
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
