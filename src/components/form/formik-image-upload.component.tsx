import React, { useEffect, useState } from "react";
import { Field, FieldProps, getIn, useFormikContext } from "formik";
import { FieldContainer } from "./field-container.component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import privateRequest from "@/healper/privateRequest";

type InputFieldProps = {
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  inputClassName?: string;
  id?: string;
};

const InputField: React.FC<
  InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  label,
  placeholder,
  disabled,
  error,
  helperText,
  inputClassName = "",
  id = "file-upload",
  ...rest
}) => (
  <FieldContainer>
    {label && <label htmlFor={id}>{label}</label>}
    <Input
      placeholder={placeholder}
      className={inputClassName}
      disabled={disabled}
      type="file"
      id={id}
      {...rest}
    />
    {helperText && (
      <small className={error ? "text-red-600 text-xs" : ""}>
        {helperText}
      </small>
    )}
  </FieldContainer>
);

type FormikUploadFieldProps = {
  inputFieldProps?: InputFieldProps;
  name: string;
  allowMultiple?: boolean; // 🔹 Flag for single/multiple uploads
};

export const FormikImageUploadField: React.FC<FormikUploadFieldProps> = ({
  inputFieldProps,
  name,
  allowMultiple = false, // Default: single upload
}) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  // Preserve existing images on re-render
  useEffect(() => {
    const existingValue = getIn(values, name); // 🔹 Dynamically get nested value
  
    if (allowMultiple && Array.isArray(existingValue) && existingValue.length > 0) {
      setPreviewUrls(existingValue);
    } else if (!allowMultiple && typeof existingValue === "string") {
      setPreviewUrls([existingValue]);
    }
  }, [values, name, allowMultiple]);
  

  // 🔹 **Upload Image to Cloudinary API**
  const uploadImage = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await privateRequest.post<{ data: { imageUrl: string }}>(
        "/images/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.data.imageUrl; // Return uploaded image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // 🔹 **Handle File Change & Upload**
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;
  
    const uploadedUrls: string[] = allowMultiple ? [...previewUrls] : [];
  
    // 🔹 **Set uploading state before actual upload starts**
    const newUploadingState: Record<number, boolean> = {};
    Array.from(files).forEach((_, index) => {
      newUploadingState[uploadedUrls.length + index] = true;
    });
    setUploading((prev) => ({ ...prev, ...newUploadingState }));
  
    await Promise.all(
      Array.from(files).map(async (file, index) => {
        const fileIndex = uploadedUrls.length + index;
        const uploadedImageUrl = await uploadImage(file, fileIndex);
  
        if (uploadedImageUrl) {
          uploadedUrls.push(uploadedImageUrl);
        }
      })
    );
  
    setPreviewUrls(uploadedUrls);
    setFieldValue(name, allowMultiple ? uploadedUrls : uploadedUrls[0]);
  };
  

  // 🔹 **Handle Remove Image**
  const handleRemoveImage = (index: number) => {
    const updatedUrls = [...previewUrls];
    updatedUrls.splice(index, 1);
    setPreviewUrls(updatedUrls);
    setFieldValue(name, allowMultiple ? updatedUrls : null);
  };

  return (
    <Field name={name}>
      {({ meta: { touched, error }, form: { isSubmitting } }: FieldProps) => {
        const helperText = touched && error ? error : inputFieldProps?.helperText;

        return (
          <div className="space-y-4">
            <InputField
              {...inputFieldProps}
              error={touched && !!error}
              helperText={helperText}
              disabled={inputFieldProps?.disabled || isSubmitting}
              onChange={handleFileChange}
              multiple={allowMultiple} // 🔹 Allow multiple file selection
            />

            {/* Image Previews with Remove & Upload Loader */}
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative inline-block">
                  {uploading[index] ? (
                    <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-200">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <Image
                        src={url}
                        alt="Selected file preview"
                        width={200}
                        height={200}
                        className="rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Field>
  );
};
