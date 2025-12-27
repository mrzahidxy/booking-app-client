import { publicRequest } from "@/shared/lib/api";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export const signUp = async (values: SignupPayload) => {
  return publicRequest.post("/auth/signup", values);
};
