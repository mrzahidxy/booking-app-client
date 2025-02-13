"use client";

import { DialogContent } from "@/components/ui/dialog";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DynamicTable } from "@/components/ui/dynamic-data-table.component";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Define the product interface to type the data
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  tags: string;
  image: string | null;
  createdAt: string;
  updateAt: string;
}

// Separate component for rendering the image in a table cell
const ImageCell: React.FC<{ row: { original: Product } }> = ({ row }) => {
  const imageUrl = row.original.image || "/placeholder-image.png"; // Fallback if image is null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          width={60}
          height={60}
          alt={`Image of ${row.original.name}`}
          src={imageUrl}
          className="cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <Image
          width={400}
          height={400}
          alt={`Image of ${row.original.name}`}
          src={imageUrl}
          className="w-full h-auto"
        />
      </DialogContent>
    </Dialog>
  );
};

// Define the columns for the DataTable
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => <ImageCell row={row} />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div>
        <Link href={`/admin/products/edit/${row.original.id}`}>
          <EditIcon />
        </Link>
      </div>
    ),
  },
];

const ProductPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicTable<Product>
        title="Products"
        url="/products"
        buttonText="Add Product"
        addUrl="/admin/products/add"
        columns={columns}
        queryKey="productsList"
      />
    </Suspense>
  );
};

export default ProductPage;
