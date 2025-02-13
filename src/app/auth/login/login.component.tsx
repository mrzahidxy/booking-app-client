"use client";

import { Formik } from "formik";
import { LogInForm } from "./login-form.component";
import { InitialValue, LoginCreate, LoginSchema } from "./form.config";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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
        description: res?.error,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-violet-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-violet-800 mb-6">
          Booking App
        </h1>
        <Formik
          initialValues={InitialValue}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <LogInForm />
        </Formik>
      </div>
    </div>
  );
};
