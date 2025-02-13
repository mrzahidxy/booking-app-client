"use client";

import { Formik } from "formik";
import { ProductForm } from "./product-form.component";
import { InitialValue, ProductCreate, ProductSchema } from "./form.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";

export const ProductCreateUpdate = ({ id }: any) => {
  const router = useRouter();

  const fetchData = async (id: string) => {
    const response = await privateRequest.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`
    );
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["productsList", id],
    queryFn: () => fetchData(id),
    enabled: !!id,
  });

  // Display loading state
  if (isLoading) return <div>Loading...</div>;

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const handleSubmit = async (values: ProductCreate) => {

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    if (typeof values.image === "string" || values.image instanceof Blob) {
      formData.append("image", values.image);
    }
    formData.append("tags", "women, saree");

    const response = id ? await privateRequest.put(`/products/${id}`, formData) : await privateRequest.post("/products", formData);
    if (response) {
      router.push("/admin/products");
    }
  };

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>{id ? "Update Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={
            id
              ? {
                  ...data?.data,
                  tags: data?.data?.tags?.split(",")
                }
              : InitialValue
          }
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
        >
          <ProductForm />
        </Formik>
      </CardContent>
    </Card>
  );
};
