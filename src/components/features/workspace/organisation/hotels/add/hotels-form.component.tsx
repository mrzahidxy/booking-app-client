"use client";

import { Form, FieldArray } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { FormikImageUploadField } from "@/components/common/form/formik-image-upload.component";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import FormikPaginatedDropdown from "@/components/common/form/formik-paginatedDropdown.component";

export const HotelForm = ({
  showTenantSelector = false,
}: {
  showTenantSelector?: boolean;
}) => {
  return (
    <Form>
      <CardContent className="space-y-6">
        {showTenantSelector ? (
          <FormikPaginatedDropdown
            label="Tenant"
            url="/admin/tenants"
            formikField="tenantId"
          />
        ) : null}

        <FormikInputField
          name="name"
          inputFieldProps={{
            label: "Hotel name",
            placeholder: "Enter hotel name",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="description"
          inputFieldProps={{
            label: "Description",
            placeholder: "Enter hotel description",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="amenities"
          inputFieldProps={{
            label: "Amenities",
            placeholder: "Free WiFi, Pool, Spa",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="location"
          inputFieldProps={{
            label: "Location",
            placeholder: "Enter hotel location",
            inputClassName: "py-3",
          }}
        />

        <FormikImageUploadField
          name="image"
          inputFieldProps={{ label: "Hotel images" }}
          allowMultiple
        />

        <FieldArray name="rooms">
          {({ push, remove, form }) => (
            <div className="space-y-6">
              <label className="text-lg font-medium">Rooms</label>

              {form.values.rooms?.length > 0 ? (
                form.values.rooms.map((room: any, index: number) => (
                  <div
                    key={index}
                    className="relative space-y-4 rounded-xl border border-border p-4"
                  >
                    <FormikInputField
                      name={`rooms.${index}.roomType`}
                      inputFieldProps={{
                        label: "Room type",
                        placeholder: "Single, Double, Suite",
                        inputClassName: "py-3",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.price`}
                      inputFieldProps={{
                        label: "Price",
                        placeholder: "Enter room price",
                        inputClassName: "py-3",
                        type: "number",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.quantity`}
                      inputFieldProps={{
                        label: "Quantity",
                        placeholder: "Enter room quantity",
                        inputClassName: "py-3",
                        type: "number",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.amenities`}
                      inputFieldProps={{
                        label: "Room amenities",
                        placeholder: "Balcony, TV, AC",
                        inputClassName: "py-3",
                      }}
                    />

                    <FormikImageUploadField
                      name={`rooms.${index}.image`}
                      inputFieldProps={{ label: "Room images" }}
                      allowMultiple
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      className="absolute right-2 top-2"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No rooms added. Click below to add rooms.
                </p>
              )}

              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  push({
                    roomId: null,
                    roomType: "",
                    price: 0,
                    image: [],
                    quantity: 1,
                    amenities: "",
                  })
                }
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add room
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>

      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Save hotel" />
      </CardFooter>
    </Form>
  );
};
