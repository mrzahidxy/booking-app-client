"use client";

import { useState } from "react";
import { Form, useFormikContext } from "formik";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import FormikPaginatedDropdown from "@/components/form/formik-paginatedDropdown.component";
import { AssignedPermissionCreate } from "./form.config";
import { Loader2 } from "lucide-react";
import { FormikSubmitButton } from "@/components/form";
import { TPermission, TPermissionsResponse } from "@/models/role-permission";

const fetchPermissions = async (page: number) => {
  const response = await privateRequest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/permissions?page=${page}&limit=10`
  );
  return response.data?.data ?? { collection: [], pagination: {} };
};

export const AssignedPermissionsForm = () => {
  const { values, setFieldValue, errors } =
    useFormikContext<AssignedPermissionCreate>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<TPermissionsResponse["data"]>({
    queryKey: ["permissions", page],
    queryFn: () => fetchPermissions(page),
    staleTime: 5 * 60 * 1000,
  });

  const togglePermission = (permissionId: number) => {
    setFieldValue(
      "permissionIds",
      values.permissionIds?.includes(permissionId)
        ? values.permissionIds.filter((id) => id !== permissionId)
        : [...(values.permissionIds ?? []), permissionId]
    );
  };

  return (
    <Form>
      <CardContent className="space-y-6">
        {/* Role Selector */}
        <FormikPaginatedDropdown
          label="Select Role"
          url="/role-permission/roles"
          formikField="roleId"
        />

        {/* Permissions List */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Permissions</label>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="border rounded-md p-4 space-y-3">
                {data?.collection.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No permissions available
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.collection.map((permission:TPermission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={values.permissionIds?.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <label className="text-sm">{permission.name}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {data?.pagination?.totalPages && data?.pagination?.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={
                          data?.pagination.hasPrevPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-sm">
                        Page {data?.pagination.currentPage} of{" "}
                        {data?.pagination.totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((prev) => prev + 1)}
                        className={
                          data?.pagination.hasNextPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}

          {errors.permissionIds && (
            <p className="text-xs text-red-500">{String(errors.permissionIds)}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Assign Permissions" />
      </CardFooter>
    </Form>
  );
};
