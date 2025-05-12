import React from "react";
import { Field, FieldProps } from "formik";
import { FieldContainer } from "./field-container.component";
import { Input } from "@/components/ui/input";

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  inputClassName?: string;
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
  ...rest
}) => (
  <FieldContainer>
    {label && <label>{label}</label>}
    <Input
      placeholder={placeholder}
      className={inputClassName}
      disabled={disabled}
      {...rest}
    />
    {error && <small className="text-red-600 text-xs">{helperText}</small>}
    {!error && helperText && <small>{helperText}</small>}
  </FieldContainer>
);

type FormikArrayInputProps = {
  inputFieldProps?: InputFieldProps;
  name: string;
};

export const FormikArrayInput: React.FC<FormikArrayInputProps> = ({
  inputFieldProps,
  name,
}) => {
  return (
    <Field name={name}>
      {({
        field,
        meta: { touched, error },
        form: { setFieldValue },
      }: FieldProps) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
            .split(",") // Split by comma
            .map((item) => item.trim()) // Trim spaces
            .filter((item) => item !== ""); // Remove empty items

            console.log("value",value)
          setFieldValue(name, value);
        };

        return (
          <InputField
            {...field}
            {...inputFieldProps}
            placeholder={inputFieldProps?.placeholder || "Enter comma-separated values"}
            disabled={inputFieldProps?.disabled}
            onChange={handleChange}
            value={field.value?.join(", ")}
            error={!!(touched && error)}
            helperText={touched && error ? error : inputFieldProps?.helperText}
          />
        );
      }}
    </Field>
  );
};
