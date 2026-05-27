"use client";

import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import privateRequest from "@/shared/lib/api";
import { getPrimaryTenantId } from "@/shared/lib/session";
import { useToast } from "@/shared/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { HotelForm } from "./hotels-form.component";
import { HotelCreate, HotelSchema, InitialValues } from "./form.config";

const fetchHotelDetails = async (id: string) => {
  const response = await privateRequest.get(`/properties/hotels/${id}`);
  return response.data.data;
};

export const HotelCreateUpdate = ({ id }: { id?: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const defaultTenantId = getPrimaryTenantId(session);

  const validate = (values: HotelCreate): FormikErrors<HotelCreate> => {
    const errors: FormikErrors<HotelCreate> = {};

    return errors;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotels", id],
    queryFn: () => fetchHotelDetails(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
  });

  const mutation = useMutation({
    mutationFn: async (values: HotelCreate) => {
      const payload = {
        name: values.name,
        tenantId: values.tenantId,
        location: values.location,
        image: values.image,
        description: values.description,
        amenities: values.amenities
          ? values.amenities.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        rooms: values.rooms?.map((room) => ({
          roomId: room.roomId,
          roomType: room.roomType,
          price: Number(room.price),
          image: room.image,
          quantity: Number(room.quantity),
          amenities: room.amenities
            ? room.amenities.split(",").map((item) => item.trim()).filter(Boolean)
            : [],
        })),
      };

      return id
        ? privateRequest.put(`/properties/hotels/${id}`, payload)
        : privateRequest.post(`/properties/hotels`, payload);
    },
  });

  const handleSubmit = async (
    values: HotelCreate,
    { resetForm, setSubmitting }: FormikHelpers<HotelCreate>
  ) => {
    try {
      await mutation.mutateAsync(values);

      toast({
        title: "Success",
        description: `Hotel ${id ? "updated" : "created"} successfully!`,
      });

      queryClient.invalidateQueries({ queryKey: ["tenant-organisation"] });
      resetForm();
      router.push("/workspace/organisation");
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

  const initialValues: HotelCreate =
    id && data
      ? {
          id: data.id ?? null,
          tenantId: data.tenantId ?? defaultTenantId,
          name: data.name || "",
          location: data.location || "",
          image: Array.isArray(data.image) ? data.image : [],
          description: data.description || "",
          amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : "",
          rooms: Array.isArray(data.rooms)
            ? data.rooms.map((room: any) => ({
                roomId: room.id ?? room.roomId ?? null,
                roomType: room.roomType || "",
                price: room.price ?? 0,
                image: Array.isArray(room.image) ? room.image : [],
                quantity: room.quantity ?? 1,
                amenities: Array.isArray(room.amenities)
                  ? room.amenities.join(", ")
                  : "",
              }))
            : InitialValues.rooms,
        }
      : {
          ...InitialValues,
          tenantId: defaultTenantId,
        };

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading hotel details...</div>;
  }

  if (isError) {
    return <div className="p-6 text-sm text-destructive">Unable to load hotel details.</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={HotelSchema}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Card className="w-full max-w-6xl p-4">
        <HotelForm showTenantSelector={false} />
      </Card>
    </Formik>
  );
};
