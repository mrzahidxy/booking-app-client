"use client";

import { Form, useFormikContext } from "formik";
import privateRequest from "@/healper/privateRequest";
import { useQuery } from "@tanstack/react-query";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import FormikPaginatedDropdown from "@/components/common/Formik-PaginatedDropdown";
import { AssignedPermissionCreate } from "./form.config";
import { Loader2 } from "lucide-react";
import { FormikSubmitButton } from "@/components/form";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const fetchPermissions = async (page: number) => {
  const response = await privateRequest.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/role-permission/permissions?page=${page}&limit=10`
  );
  return response.data ?? { collection: [], pagination: {} };
};
export const AssignedPermissionsForm = ({ id }: { id?: string }) => {
  const { values, setFieldValue, errors } =
    useFormikContext<AssignedPermissionCreate>();
  const [page, setPage] = useState(1);

  // Fetch permissions
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions", page],
    queryFn: () => fetchPermissions(page),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data,
  });

  // Save permission in state
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
        {/* Role Selector with Pagination */}
        <FormikPaginatedDropdown
          label="Select Role"
          url="/role-permission/roles"
          formikField="roleId"
        />
        {/* Permissions List */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Permissions</label>
          {permissionsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="border rounded-md p-4 space-y-3">
                {permissionsData?.collection.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No permissions available
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionsData.collection.map(
                      (permission: { id: number; name: string }) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={values.permissionIds?.includes(
                              permission.id
                            )}
                            onCheckedChange={() =>
                              togglePermission(permission.id)
                            }
                          />
                          <label className="text-sm">{permission.name}</label>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {permissionsData?.pagination?.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className={
                          permissionsData.pagination.hasPrevPage
                            ? "cursor-pointer"
                            : "pointer-events-none opacity-50"
                        }
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="text-sm">
                        Page {permissionsData.pagination.currentPage} of{" "}
                        {permissionsData.pagination.totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((prev) => prev + 1)}
                        className={
                          permissionsData.pagination.hasNextPage
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
            <p className="text-red-500">{errors.permissionIds}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Assign Permissions" />
      </CardFooter>
    </Form>
  );
};
