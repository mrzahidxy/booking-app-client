"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import TableActionButtons from "@/components/common/table-actions.component";
import { useMutation } from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import queryClient from "@/app/config/queryClient";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

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
      cell: ({ row }) => <img style={{ width: "100px" }} src={row.original.image[0]} />,
    },
    { accessorKey: "name", header: "User Name" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "rooms",
      header: "rooms",
      cell: ({ row }) => (
        <ul>
          {row.original.rooms.map((room: any) => (
            <li key={room.id}>{room.roomType}</li>
          ))}
        </ul>
      ), //</ul> row.original.rooms.map((room: any) => room.roomType + ", "),
    },
    { accessorKey: "createdAt", header: "Created At" },
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
        title="Hotel"
        queryKey="hotels-list"
        buttonText="Create Hotel"
        handleAdd={() => router.push("/admin/hotels/add")}
      />
    </Suspense>
  );
};

export default HotelsPage;
