"use client";

import Image from "next/image";
import { Suspense } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { RequirePlatformAdmin } from "@/components/features/admin/RequirePlatformAdmin";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const imageCell = (alt: string) =>
  function ImageCell({ row }: { row: any }) {
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
        alt={row.original.name ?? alt}
        width={96}
        height={64}
      />
    );
  };

const hotelColumns: ColumnDef<any>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: imageCell("Hotel image"),
  },
  { accessorKey: "name", header: "Hotel Name" },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "rooms",
    header: "Rooms",
    cell: ({ row }) => (
      <ul className="space-y-1 text-xs text-slate-500">
        {row.original.rooms?.map((room: any) => (
          <li key={room.id}>{room.roomType}</li>
        )) ?? <li>-</li>}
      </ul>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  { accessorKey: "ratings", header: "Ratings" },
];

const restaurantColumns: ColumnDef<any>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: imageCell("Restaurant image"),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "cuisine",
    header: "Cuisine",
    cell: ({ row }) => (
      <ul className="space-y-1">
        {row.original.cuisine?.map((cuisine: string) => (
          <li key={cuisine}>{cuisine}</li>
        ))}
      </ul>
    ),
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
        <ul className="space-y-1">
          {menuItems.map((item: { name: string; price: number }, index: number) => (
            <li key={index}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  { accessorKey: "ratings", header: "Ratings" },
];

const PropertiesPage = () => {
  return (
    <RequirePlatformAdmin>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View platform hotel and restaurant listings. Owners manage their own organisation details from their workspace.
          </p>
        </div>

        <Tabs defaultValue="hotels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          </TabsList>
          <TabsContent value="hotels">
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicTable
                columns={hotelColumns}
                url="/properties/hotels"
                title="Hotels"
                description="Global read-only hotel overview."
                queryKey="admin-hotels-list"
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="restaurants">
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicTable
                columns={restaurantColumns}
                url="/properties/restaurants"
                title="Restaurants"
                description="Global read-only restaurant overview."
                queryKey="admin-restaurants-list"
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </RequirePlatformAdmin>
  );
};

export default PropertiesPage;
