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

const HotelsPage = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: number) => {
      return await privateRequest.delete(
        `/hotels/${id}`
      );
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
            alt={row.original.name ?? "Hotel image"}
            width={96}
            height={64}
          />
        );
      },
    },
    { accessorKey: "name", header: "Hotel Name" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "rooms",
      header: "Rooms",
      cell: ({ row }) => (
        <ul className="space-y-1 text-xs text-slate-500">
          {row.original.rooms.map((room: any) => (
            <li key={room.id}>{room.roomType}</li>
          ))}
        </ul>
      ), //</ul> row.original.rooms.map((room: any) => room.roomType + ", "),
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
          onEdit={(id) =>
            router.push(`/admin/hotels/edit/${id}`)
          }
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
        url="/hotels"
        title="Hotels"
        description="Manage all hotels in the platform"
        queryKey="hotels-list"
        buttonText="Add New Hotel"
        handleAdd={() => router.push("/admin/hotels/add")}
      />
    </Suspense>
  );
};

export default HotelsPage;
