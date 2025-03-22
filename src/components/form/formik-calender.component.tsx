"use client";

import { Field, FieldProps, useFormikContext } from "formik";
import { Calendar } from "@/components/ui/calendar";
import { FieldContainer } from "./field-container.component";

type CalendarFieldProps = {
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  inputClassName?: string;
};

const CalendarField: React.FC<
  CalendarFieldProps & {
    value: Date | null;
    onSelect: (date: Date | undefined) => void;
  }
> = ({
  label,
  placeholder = "Select a date",
  disabled,
  error,
  helperText,
  inputClassName = "",
  value,
  onSelect,
}) => {
  return (
    <FieldContainer>
      {label && <label className="text-sm font-medium">{label}</label>}

      <Calendar
        mode="single"
        selected={value!}
        onSelect={(date) => {
          onSelect(date);
        }}
        disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)} // ✅ Allows today, disables past dates
      />

      {error && <small className="text-red-600 text-xs">{helperText}</small>}
      {!error && helperText && <small>{helperText}</small>}
    </FieldContainer>
  );
};

type FormikCalendarFieldProps = {
  name: string;
  inputFieldProps?: CalendarFieldProps;
};

export const FormikCalendarField: React.FC<FormikCalendarFieldProps> = ({
  name,
  inputFieldProps,
}) => {
  const { setFieldValue } = useFormikContext<any>();

  return (
    <Field name={name}>
      {({
        field,
        meta: { touched, error },
        form: { isSubmitting },
      }: FieldProps) => {
        const helperText =
          touched && error ? error : inputFieldProps?.helperText;
        const value = field.value ? new Date(field.value) : null;

        return (
          <CalendarField
            {...inputFieldProps}
            value={value}
            onSelect={(date) => setFieldValue(name, date)}
            error={!!(touched && error)}
            helperText={helperText}
            disabled={inputFieldProps?.disabled || isSubmitting}
          />
        );
      }}
    </Field>
  );
};
