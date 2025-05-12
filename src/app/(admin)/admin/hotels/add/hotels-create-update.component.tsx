"use client";

import { Formik, FormikHelpers } from "formik";
import { HotelCreate, HotelSchema, InitialValues } from "./form.config";
import privateRequest from "@/healper/privateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { HotelForm } from "./hotels-form.component";

const fetchHotelDetails = async (id: string) => {
  const response = await privateRequest.get(`/hotels/${id}`);
  return response.data.data;
};

export const HotelCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 🔹 Fetch Hotel Data (if updating)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotels", id],
    queryFn: () => fetchHotelDetails(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });

  // 🔹 Handle Form Submission (Create/Update)
  const mutation = useMutation({
    mutationFn: async (values: any) =>
      id
        ? privateRequest.put(`/hotels/${id}`, values)
        : privateRequest.post(`/hotels`, values),
  });

  const handleSubmit = async (
    values: HotelCreate,
    { resetForm, setSubmitting }: FormikHelpers<HotelCreate>
  ) => {
    try {
      await mutation.mutateAsync({
        name: values.name,
        location: values.location,
        image: values.image,
        description: values.description,
        amenities: values?.amenities?.split(","),
        rooms: values.rooms?.map((room: any) => ({
          roomId: room.roomId,
          roomType: room.roomType,
          price: room.price,
          image: room.image,
          quantity: room.quantity,
          amemnities: values?.amenities?.split(","),
        })),
      });

      toast({
        title: "Success",
        description: `Hotel ${id ? "updated" : "created"} successfully!`,
      });

      resetForm();
      router.push("/admin/hotels");
      queryClient.invalidateQueries({ queryKey: ["hotels-list"] });
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
              image: data.image || "",
              description: data.description || "",
              amenities: Array.isArray(data.amenities)
                ? data.amenities.join(",")
                : "",
              rooms:data.rooms
            }
          : InitialValues
      }
      validationSchema={HotelSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <HotelForm />
      </Card>
    </Formik>
  );
};
