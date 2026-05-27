"use client";

import { Form, FieldArray } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FormikInputField, FormikSubmitButton } from "@/components/common/form";
import { FormikImageUploadField } from "@/components/common/form/formik-image-upload.component";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import FormikPaginatedDropdown from "@/components/common/form/formik-paginatedDropdown.component";

export const RestaurantForm = ({
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
            label: "Restaurant name",
            placeholder: "Enter restaurant name",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="description"
          inputFieldProps={{
            label: "Description",
            placeholder: "Enter restaurant description",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="cuisine"
          inputFieldProps={{
            label: "Cuisine",
            placeholder: "Italian, Bengali, Grill",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="timeSlots"
          inputFieldProps={{
            label: "Time slots",
            placeholder: "MORNING, AFTERNOON, EVENING",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="location"
          inputFieldProps={{
            label: "Location",
            placeholder: "Enter restaurant location",
            inputClassName: "py-3",
          }}
        />

        <FormikInputField
          name="seats"
          inputFieldProps={{
            label: "Seats",
            placeholder: "Enter seat count",
            inputClassName: "py-3",
            type: "number",
          }}
        />

        <FormikImageUploadField
          name="image"
          inputFieldProps={{ label: "Restaurant images" }}
          allowMultiple
        />

        <FieldArray name="menu">
          {({ push, remove, form }) => (
            <div className="space-y-6">
              <label className="text-lg font-medium">Menu items</label>

              {form.values.menu?.length > 0 ? (
                form.values.menu.map((menu: any, index: number) => (
                  <div
                    key={index}
                    className="relative space-y-4 rounded-xl border border-border p-4"
                  >
                    <FormikInputField
                      name={`menu.${index}.name`}
                      inputFieldProps={{
                        label: "Item name",
                        placeholder: "Burger, Pasta, Rice bowl",
                        inputClassName: "py-3",
                      }}
                    />

                    <FormikInputField
                      name={`menu.${index}.price`}
                      inputFieldProps={{
                        label: "Price",
                        placeholder: "Enter item price",
                        inputClassName: "py-3",
                        type: "number",
                      }}
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
                  No menu items added. Click below to add items.
                </p>
              )}

              <Button
                variant="outline"
                type="button"
                onClick={() => push({ name: "", price: 0 })}
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add item
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>

      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Save restaurant" />
      </CardFooter>
    </Form>
  );
};
