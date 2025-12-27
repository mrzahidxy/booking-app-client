"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import privateRequest from "@/shared/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Button } from "./button";
import { DataTable } from "./data-table.component";
import DefaultLoader from "../common/DefaultLoacer.component";
import { Plus } from "lucide-react";

interface DynamicTableProps<TData> {
  url: string;
  columns: ColumnDef<TData>[];
  title?: string;
  description?: string;
  buttonText?: string;
  queryKey: string;
  handleAdd?: () => void
}


export function DynamicTable<TData>({
  url,
  columns,
  title,
  description,
  buttonText,
  queryKey,
  handleAdd
}: DynamicTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam);
  const limit = 10;

  // Function to fetch data from the API
  const fetchData = async (page: number, limit: number) => {
    const response = await privateRequest.get(
      `${url}?page=${page}&limit=${limit}`
    );
    return response.data;
  };

  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, page],
    queryFn: () => fetchData(page, limit),
  });

  // Display loading state
  if (isLoading)
    return (
      <div className="w">
        <DefaultLoader showImage={false} />
      </div>
    );

  // Display error state
  if (isError) return <div>Error fetching data: {error.message}</div>;

  const { collection: tableData, pagination } = data?.data || {};

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      router.push(`?page=${newPage}`);
    }
  };

  return (
    <section className="space-y-6">
      {(title || buttonText) && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {buttonText && handleAdd && (
            <Button
              className="h-10 gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
              {buttonText}
            </Button>
          )}
        </div>
      )}

      <DataTable columns={columns} data={tableData ?? []} />

      {pagination?.totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
