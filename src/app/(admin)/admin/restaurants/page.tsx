"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/shared/lib/api";
import queryClient from "@/shared/lib/query-client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

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
      cell: ({ row }) => {
        const imageSrc = row.original.image?.[0];

        if (!imageSrc) {
          return (
            <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-muted/50 text-xs text-muted-foreground">
              No image
            </div>
          );
        }

        return (
          <Image
            className="h-16 w-24 rounded-xl object-cover"
            src={imageSrc}
            alt={row.original.name ?? "Restaurant image"}
            width={96}
            height={64}
          />
        );
      },
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
      cell: ({ row }) => {
        const rawMenu = row.original.menu;
        const parsedMenu =
          typeof rawMenu === "string"
            ? (() => {
                try {
                  return JSON.parse(rawMenu);
                } catch {
                  return [];
                }
              })()
            : rawMenu;

        const menuItems = Array.isArray(parsedMenu) ? parsedMenu : [];

        return (
          <ul>
            {menuItems.map(
              (item: { name: string; price: number }, index: number) => (
                <li key={index}>
                  {item.name} -{item.price}
                </li>
              )
            )}
          </ul>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return date.toLocaleDateString();
      },
    },
    { accessorKey: "ratings", header: "Ratings" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <TableActionButtons
          id={row.original.id}
          onEdit={(id) => router.push(`/admin/restaurants/edit/${id}`)}
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
        description="Manage all restaurants in the platform"
        queryKey="restaurants-list"
        buttonText="Add New Restaurant"
        handleAdd={() => router.push("/admin/restaurants/add")}
      />
    </Suspense>
  );
};

export default RestaurantListPage;
