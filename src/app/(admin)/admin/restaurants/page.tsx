"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import queryClient from "@/app/config/queryClient";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const RestaurantListPage = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return await privateRequest.delete(`/hotels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels-list"] });
    },
  });

  const handleDelete = (id: number) => {
    mutate(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <img style={{ width: "100px" }} src={row.original.image[0]} />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "cuisine",
      header: "Cuisine",
      cell: ({ row }) => (
        <ul>
          {row.original.cuisine?.map((cuisine: string) => (
            <li key={cuisine}>{cuisine}</li>
          ))}
        </ul>
      )
    },
    {
      accessorKey: "menu",
      header: "Menu",
      cell: ({ row }) => (
        <ul>
          {JSON.parse(row.original.menu)?.map((item: { name: string; price: number }, index: number) => (
            <li key={index}>{item.name} -{item.price}</li>
          ))}
        </ul>
      )
    },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "ratings", header: "Ratings" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          onEdit={(id) => router.push(`/admin/hotels/edit/${id}`)}
          onDelete={(id) => handleDelete(Number(id))}
          loading={isPending}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable
        columns={columns}
        url="/restaurants"
        title="Restaurants"
        queryKey="restaurants-list"
        buttonText="Create Restaurant"
        handleAdd={() => router.push("/admin/restaurants/add")}
      />
    </Suspense>
  );
};

export default RestaurantListPage;
