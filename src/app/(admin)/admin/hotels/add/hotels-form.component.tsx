"use client";

import { Form, FieldArray } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FormikInputField, FormikSubmitButton } from "@/components/form";
import { FormikImageUploadField } from "@/components/form/formik-image-upload.component";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { FormikArrayInput } from "@/components/form/formik-array-input.component";

export const HotelForm = () => {
  return (
    <Form>
      <CardContent className="space-y-6">
        {/* 🔹 Hotel Details */}
        <FormikInputField
          name="name"
          inputFieldProps={{
            label: "Hotel Name",
            placeholder: "Enter hotel name",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="description"
          inputFieldProps={{
            label: "Hotel Description",
            placeholder: "Enter hotel description",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="amenities"
          inputFieldProps={{
            label: "Hotel Amenities (comma-separated)",
            placeholder: "E.g., Free WiFi, Swimming Pool, Spa",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="location"
          inputFieldProps={{
            label: "Location",
            placeholder: "Enter hotel location",
            inputClassName: "outlined-none py-3",
          }}
        />

        {/* 🔹 Hotel Image */}
        <FormikImageUploadField
          name="image"
          inputFieldProps={{ label: "Upload Hotel Image" }}
          allowMultiple
        />

        {/* 🔹 Rooms Section */}
        <FieldArray name="rooms">
          {({ push, remove, form }) => (
            <div className="space-y-6">
              <label className="text-lg font-medium">Rooms</label>

              {form.values.rooms?.length > 0 ? (
                form.values.rooms?.map((room: any, index: number) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md relative space-y-4"
                  >
                    <FormikInputField
                      name={`rooms.${index}.roomType`}
                      inputFieldProps={{
                        label: "Room Type",
                        placeholder: "E.g.,   SINGLE, DOUBLE, TWIN, TRIPLE",
                        inputClassName: "outlined-none py-3",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.price`}
                      inputFieldProps={{
                        label: "Price",
                        placeholder: "Enter room price",
                        inputClassName: "outlined-none py-3",
                        type: "number",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.quantity`}
                      inputFieldProps={{
                        label: "Quantity",
                        placeholder: "Enter room quantity",
                        inputClassName: "outlined-none py-3",
                        type: "number",
                      }}
                    />

                    <FormikInputField
                      name={`rooms.${index}.amenities`}
                      inputFieldProps={{
                        label: "Hotel Amenities (comma-separated)",
                        placeholder: "E.g., Free WiFi, Swimming Pool, Spa",
                        inputClassName: "outlined-none py-3",
                      }}
                    />

                    <FormikImageUploadField
                      name={`rooms.${index}.image`}
                      inputFieldProps={{ label: "Upload Room Image" }}
                      allowMultiple
                    />

                    {/* Remove Room Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
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

              {/* Add Room Button */}
              <Button
                variant="outline"
                onClick={() => push({ roomType: "", price: "", image: "" })}
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Room
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>

      <CardFooter className="flex justify-end">
        <FormikSubmitButton text="Submit" />
      </CardFooter>
    </Form>
  );
};
