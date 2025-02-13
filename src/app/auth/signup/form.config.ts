
import { User } from "@/models";
import * as yup from "yup";

export const SignInSchema = yup.object({
  name: yup.string().label("Username").min(1).max(50).required(),
  email: yup.string().label("Email").required(),
  password: yup.string().label("Password").min(4).required(),
});

export type SignInRequest = yup.InferType<typeof SignInSchema>;

export const InitialValue: SignInRequest = {
  name: "",
  email: "",
  password: "",
};

type SignInResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

// export type SignInApiResponse = ReturnType<
//   typeof usePost<SignInRequest, SignInResponse>
// >;
// export type SignInApiError = SignInApiResponse["error"];
