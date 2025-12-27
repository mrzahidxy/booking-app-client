"use client";

import { Formik, FormikHelpers } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import privateRequest from "@/shared/lib/api";
import { useToast } from "@/shared/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { RestaurantForm } from "./restaurant-form.component";
import { RestaurantCreate, RestaurantSchema, InitialValues } from "./form.config";

const fetchRestaurantDetails = async (id: string) => {
  const response = await privateRequest.get(`/restaurants/${id}`);
  return response.data.data;
};

export const RestaurantCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
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
        ? privateRequest.put(`/restaurants/${id}`, payload)
        : privateRequest.post(`/restaurants`, payload);
    },
  });

  const handleSubmit = async (
    values: RestaurantCreate,
    { resetForm, setSubmitting }: FormikHelpers<RestaurantCreate>
  ) => {
    try {
      await mutation.mutateAsync(values);
      toast({
        title: "Success",
        description: `Restaurant ${id ? "updated" : "created"} successfully!`,
      });
      resetForm();
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



  return (
    <Formik
      initialValues={
        id && data
          ? {
              name: data.name || "",
              location: data.location || "",
              image: Array.isArray(data.image) ? data.image : [],
              description: data.description || "",
              cuisine: data.cuisine?.join(",") || "",
              seats: data.seats || 0,
              menu: normalizeMenu(data.menu),
              timeSlots: data.timeSlots?.join(",") || "",
            }
          : InitialValues
      }
      validationSchema={RestaurantSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <RestaurantForm />
      </Card>
    </Formik>
  );
};
