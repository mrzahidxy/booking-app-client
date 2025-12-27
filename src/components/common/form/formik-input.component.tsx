import React from "react";
import { Field, FieldProps, GenericFieldHTMLAttributes } from "formik";
import { FieldContainer } from "./field-container.component";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InputFieldProps = {
  type?: string; // Added type with default to "text"
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  inputClassName?: string;
  id?: string;
  name?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text", // Default type to "text"
  disabled,
  placeholder,
  error,
  helperText,
  inputClassName = "",
  ...rest
}) => {
  const fieldId = rest.id ?? rest.name;

  return (
    <FieldContainer>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <Textarea
          placeholder={placeholder}
          className={inputClassName}
          disabled={disabled}
          id={fieldId}
          aria-invalid={error}
          {...rest}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          className={inputClassName}
          disabled={disabled}
          id={fieldId}
          aria-invalid={error}
          {...rest}
        />
      )}
      
      {error && <small className="text-red-600 text-xs">{helperText}</small>}
      {!error && helperText && <small>{helperText}</small>}
    </FieldContainer>
  );
};

type FormikInputFieldProps = GenericFieldHTMLAttributes & {
  inputFieldProps?: InputFieldProps;
};

export const FormikInputField: React.FC<FormikInputFieldProps> = ({
  inputFieldProps,
  disabled,
  ...rest
}) => {
  return (
    <Field {...rest}>
      {({
        field,
        meta: { touched, error },
        form: { isSubmitting },
      }: FieldProps) => {
        const helperText =
          touched && error ? error : inputFieldProps?.helperText;

        return (
          <InputField
            {...field}
            {...inputFieldProps}
            type={inputFieldProps?.type || "text"} // Ensure the type defaults to "text"
            disabled={disabled || isSubmitting}
            error={!!(touched && error)}
            helperText={helperText}
          />
        );
      }}
    </Field>
  );
};
