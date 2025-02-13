import * as yup from "yup";

// Validation schema using Yup
export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

// Type for the login form values
export type LoginCreate = yup.InferType<typeof LoginSchema>;

// Initial values for the form
export const InitialValue: LoginCreate = {
  email: "",
  password: "",
};
