import * as yup from "yup"

// User Profile Schema Validation
export const UserProfileSchema = yup.object({
  id: yup.number().nullable(),
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup
    .string()
    .nullable()
    .matches(/^[+]?[\d\s\-()]+$/, "Invalid phone number format"),
})

// Password Change Schema
export const PasswordChangeSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase and number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
})

// Type Definitions
export type UserProfileUpdate = yup.InferType<typeof UserProfileSchema>
export type PasswordChange = yup.InferType<typeof PasswordChangeSchema>

// Initial Values
export const UserProfileInitialValues: UserProfileUpdate = {
  id: null,
  name: "",
  email: "",
  phone: "",
}

export const PasswordChangeInitialValues: PasswordChange = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

// API Response Interface
export interface ApiResponse<T = null> {
  isSuccess?: boolean
  statusCode?: number
  message?: string
  data?: T
}

export type UserProfileApiResponse = ApiResponse<UserProfileUpdate>
