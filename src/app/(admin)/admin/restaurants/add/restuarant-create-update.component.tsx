"use client";

import { Formik, FormikHelpers } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import privateRequest from "@/healper/privateRequest";
import { useToast } from "@/hooks/use-toast";
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurants", id],
    queryFn: () => fetchRestaurantDetails(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });

  const mutation = useMutation({
    mutationFn: async (values: RestaurantCreate) =>
      id
        ? privateRequest.put(`/restaurants/${id}`, {
            ...values,
            cuisine: values.cuisine.split(","),
            timeSlots: values.timeSlots.split(","),
            menu: JSON.stringify(values.menu),
          })
        : privateRequest.post(`/restaurants`,  {
            ...values,
            cuisine: values.cuisine.split(","),
            timeSlots: values.timeSlots.split(","),
            menu: JSON.stringify(values.menu),
          }),
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
      // router.push("/admin/restaurants");
      queryClient.invalidateQueries({ queryKey: ["restaurants-list"] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong!",
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
              menu: JSON.parse(data.menu) || [],
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
