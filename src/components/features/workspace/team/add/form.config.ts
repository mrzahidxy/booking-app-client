import * as yup from "yup";

export const TenantMemberSchema = yup.object({
  userId: yup.number().min(1, "Select a user").required(),
  role: yup
    .mixed<"OWNER" | "STAFF">()
    .oneOf(["OWNER", "STAFF"], "Select a role")
    .required(),
});

export type TenantMemberFormValues = yup.InferType<typeof TenantMemberSchema>;

export const InitialValues: TenantMemberFormValues = {
  userId: 0,
  role: "STAFF",
};
