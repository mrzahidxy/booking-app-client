"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import privateRequest from "@/healper/privateRequest";
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

interface DynamicTableProps<TData> {
  url: string;
  addUrl?: string;
  columns: ColumnDef<TData>[];
  title?: string;
  buttonText?: string;
  queryKey: string;
}


export function DynamicTable<TData>({
  url,
  addUrl,
  columns,
  title,
  buttonText,
  queryKey,
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

  const { collection: tableData, pagination } = data?.data;

  // Display no data state
  if (!tableData || tableData.length === 0) {
    return <div>No data available</div>;
  }

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      router.push(`?page=${newPage}`);
    }
  };

  return (
    <div className="space-y-4 flex flex-col">
      {/* Table Title */}
      {title && <h1 className="text-2xl font-bold">{title}</h1>}

      {/* Add Button */}
      {buttonText && addUrl && (
        <Button className="self-end" onClick={() => router.push(addUrl)}>
          {buttonText}
        </Button>
      )}

      {/* Data Table */}
      <DataTable columns={columns} data={tableData} />

      {/* Pagination Controls */}
      {pagination?.totalPages > 1 && (
        <Pagination>
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
    </div>
  );
}
