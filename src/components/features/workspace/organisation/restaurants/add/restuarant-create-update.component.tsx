"use client";

import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import privateRequest from "@/shared/lib/api";
import { getPrimaryTenantId } from "@/shared/lib/session";
import { useToast } from "@/shared/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { RestaurantForm } from "./restaurant-form.component";
import { RestaurantCreate, RestaurantSchema, InitialValues } from "./form.config";
import { useSession } from "next-auth/react";

const fetchRestaurantDetails = async (id: string) => {
  const response = await privateRequest.get(`/properties/restaurants/${id}`);
  return response.data.data;
};

export const RestaurantCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const defaultTenantId = getPrimaryTenantId(session);

  const validate = (values: RestaurantCreate): FormikErrors<RestaurantCreate> => {
    const errors: FormikErrors<RestaurantCreate> = {};

    return errors;
  };
  const normalizeList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const normalizeMenu = (menu: unknown) => {
    if (Array.isArray(menu)) {
      return menu;
    }
    if (typeof menu === "string") {
      try {
        const parsed = JSON.parse(menu);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurants", id],
    queryFn: () => fetchRestaurantDetails(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });

  const mutation = useMutation({
    mutationFn: async (values: RestaurantCreate) => {
      const payload = {
        ...values,
        cuisine: normalizeList(values.cuisine),
        timeSlots: normalizeList(values.timeSlots),
        menu: values.menu ?? [],
      };
      return id
        ? privateRequest.put(`/properties/restaurants/${id}`, payload)
        : privateRequest.post(`/properties/restaurants`, payload);
    },
  });

  const handleSubmit = async (
    values: RestaurantCreate,
    { resetForm, setSubmitting }: FormikHelpers<RestaurantCreate>
  ) => {
    try {
      await mutation.mutateAsync({
        ...values,
        tenantId: values.tenantId,
        cuisine: values.cuisine
          ? values.cuisine.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        timeSlots: values.timeSlots
          ? values.timeSlots.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        menu: Array.isArray(values.menu)
          ? values.menu.map((item) => ({
              name: item.name,
              price: Number(item.price),
            }))
          : [],
      } as any);
      toast({
        title: "Success",
        description: `Restaurant ${id ? "updated" : "created"} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["tenant-organisation"] });
      resetForm();
      router.push("/workspace/organisation");
      queryClient.invalidateQueries({ queryKey: ["restaurants-list"] });
    } catch (err: any) {
      const message =
        err?.userMessage ?? err?.response?.data?.message ?? err?.message;
      const description =
        typeof message === "string" ? message : "Something went wrong!";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };



  const initialValues: RestaurantCreate =
    id && data
      ? {
          id: data.id ?? null,
          tenantId: data.tenantId ?? defaultTenantId,
          name: data.name || "",
          location: data.location || "",
          image: Array.isArray(data.image) ? data.image : [],
          description: data.description || "",
          cuisine: Array.isArray(data.cuisine) ? data.cuisine.join(", ") : "",
          menu: normalizeMenu(data.menu),
          timeSlots: Array.isArray(data.timeSlots) ? data.timeSlots.join(", ") : "",
          seats: data.seats || 1,
        }
      : {
          ...InitialValues,
          tenantId: defaultTenantId,
        };

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading restaurant details...</div>;
  }

  if (isError) {
    return <div className="p-6 text-sm text-destructive">Unable to load restaurant details.</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RestaurantSchema}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <RestaurantForm showTenantSelector={false} />
      </Card>
    </Formik>
  );
};
