import { use, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import privateRequest from "@/healper/privateRequest";

const FormikPaginatedDropdown = ({
  label,
  url,
  formikField,
}: {
  label: string;
  url: string;
  formikField: string; // The Formik field to update with only the ID
}) => {
  const { values, setFieldValue, errors } = useFormikContext<any>();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const initializeSelectedItem = async () => {
      const id = values[formikField];
      if (id && !selectedItem) {
        const response = await privateRequest.get(`${url}/${id}`);
        const item = response.data?.data;
        if (item) {
          setSelectedItem({ id: item.id, name: item.name });
        }
      }
    };
    initializeSelectedItem();
  }, [values[formikField]]);

  // Fetch paginated data from API
  const fetchPaginatedData = async (page: number) => {
    const response = await privateRequest.get(`${url}?page=${page}&limit=10`);
    return response.data ?? { collection: [], pagination: {} };
  };

  // Fetch data using React Query
  const { data, isFetching } = useQuery({
    queryKey: [url, page],
    queryFn: () => fetchPaginatedData(page),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedItem ? selectedItem.name : `Select ${label}...`}
            {isFetching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {data?.data?.collection?.map(
                  (item: { id: number; name: string }) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        setSelectedItem(item); // ✅ Store Full Item in Local State
                        setFieldValue(formikField, item.id); // ✅ Store Only ID in Formik
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          values[formikField] === item.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
            {data?.data?.pagination?.totalPages > 1 && (
              <div className="border-t p-2">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={
                          data?.pagination?.hasPrevPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-sm">
                        Page {data?.pagination?.currentPage} of{" "}
                        {data?.pagination?.totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((prev) => prev + 1)}
                        className={
                          data?.pagination?.hasNextPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {errors[formikField] && (
        <p className="text-xs text-red-500">{String(errors[formikField])}</p>
      )}
    </div>
  );
};

export default FormikPaginatedDropdown;
