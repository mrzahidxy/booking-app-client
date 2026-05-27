import { useEffect, useState } from "react";
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
import { cn } from "@/shared/utils";
import privateRequest from "@/shared/lib/api";

const FormikPaginatedDropdown = ({
  label,
  url,
  formikField,
  disablePortal,
  excludeIds = [],
}: {
  label: string;
  url: string;
  formikField: string; // The Formik field to update with only the ID
  disablePortal?: boolean;
  excludeIds?: number[];
}) => {
  const { values, setFieldValue, errors } = useFormikContext<any>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
    email?: string;
  } | null>(null);
  const selectedValue = values[formikField];

  const getItemLabel = (item: {
    id: number;
    name?: string | null;
    email?: string | null;
  }) => item.name || item.email || `#${item.id}`;

  useEffect(() => {
    const initializeSelectedItem = async () => {
      const id = selectedValue;
      if (id && !selectedItem) {
        const response = await privateRequest.get(`${url}/${id}`);
        const item = response.data?.data;
        if (item) {
          setSelectedItem({
            id: item.id,
            name: getItemLabel(item),
            email: item.email ?? undefined,
          });
        }
      }
    };

    if (!selectedValue || selectedItem) {
      return;
    }

    initializeSelectedItem();
  }, [selectedValue, selectedItem, formikField, url]);

  // Fetch paginated data from API
  const fetchPaginatedData = async (page: number) => {
    const response = await privateRequest.get(`${url}?page=${page}&limit=10`, {
      params: search ? { search } : undefined,
    });
    return response.data ?? { collection: [], pagination: {} };
  };

  // Fetch data using React Query
  const { data, isFetching } = useQuery({
    queryKey: [url, page, search],
    queryFn: () => fetchPaginatedData(page),
    staleTime: 5 * 60 * 1000,
  });
  const items = data?.data?.collection?.filter(
    (item: { id: number }) => !excludeIds.includes(item.id)
  );

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
        <PopoverContent className="w-full p-0" disablePortal={disablePortal}>
          <Command>
            <CommandInput
              placeholder={`Search ${label}...`}
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {items?.map(
                  (item: { id: number; name?: string | null; email?: string | null }) => (
                    <CommandItem
                      key={item.id}
                      value={`${getItemLabel(item)} ${item.id}`}
                      onSelect={() => {
                        setSelectedItem({
                          id: item.id,
                          name: getItemLabel(item),
                          email: item.email ?? undefined,
                        });
                        setFieldValue(formikField, item.id);
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
                      {getItemLabel(item)}
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
                          data?.data?.pagination?.hasPrevPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-sm">
                        Page {data?.data?.pagination?.currentPage} of{" "}
                        {data?.data?.pagination?.totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((prev) => prev + 1)}
                        className={
                          data?.data?.pagination?.hasNextPage
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
