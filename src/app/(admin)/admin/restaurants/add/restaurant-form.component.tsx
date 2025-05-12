import { Form, FieldArray } from "formik";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FormikInputField, FormikSubmitButton } from "@/components/form";
import { FormikImageUploadField } from "@/components/form/formik-image-upload.component";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { FormikArrayInput } from "@/components/form/formik-array-input.component";

export const RestaurantForm = () => {
  return (
    <Form>
      {/* 🔹 Restaurant Details */}
      <CardContent className="space-y-6">
        <FormikInputField
          name="name"
          inputFieldProps={{
            label: "Restaurant Name",
            placeholder: "Enter restaurant name",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="description"
          inputFieldProps={{
            label: "Restaurant Description",
            placeholder: "Enter restaurant description",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikArrayInput
          name="cuisine"
          inputFieldProps={{
            label: "Cuisines",
            placeholder: "E.g., Italian, Chinese, Bengali",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="location"
          inputFieldProps={{
            label: "Location",
            placeholder: "Enter restaurant location",
            inputClassName: "outlined-none py-3",
          }}
        />

        <FormikInputField
          name="seats"
          inputFieldProps={{
            label: "Seats",
            placeholder: "Enter menu seats",
            inputClassName: "outlined-none py-3",
            type: "number",
          }}
        />

        {/* 🔹 Restaurant Images */}
        <FormikImageUploadField
          name="image"
          inputFieldProps={{ label: "Images" }}
          allowMultiple
        />

        {/* 🔹 Menus Section */}
        <FieldArray name="menu">
          {({ push, remove, form }) => (
            <div className="space-y-6">
              <label className="text-lg font-medium">Menus</label>

              {form.values.menu?.length > 0 ? (
                form.values.menu.map((menu: any, index: number) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md relative space-y-4"
                  >
                    <FormikInputField
                      name={`menu.${index}.name`}
                      inputFieldProps={{
                        label: "Menu Name",
                        placeholder: "E.g., Beef Burger, Pasta, etc.",
                        inputClassName: "outlined-none py-3",
                      }}
                    />

                    <FormikInputField
                      name={`menu.${index}.price`}
                      inputFieldProps={{
                        label: "Price",
                        placeholder: "Enter menu price",
                        inputClassName: "outlined-none py-3",
                        type: "number",
                      }}
                    />

                    {/* Remove Menu Button */}
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
                  No menus added. Click below to add menus.
                </p>
              )}

              {/* Add Menu Button */}
              <Button
                variant="outline"
                type="button"
                onClick={() => push({ name: "", price: 0 })}
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Menu
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
