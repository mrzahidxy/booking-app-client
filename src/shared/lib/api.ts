import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const publicRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const privateRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Interceptor to add Authorization header
privateRequest.interceptors.request.use(
  async (config) => {
    const session = await getSession()

    const token = session?.user?.token;
    if (token) {
      const authValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = authValue;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ✅ Response Interceptor: Auto Sign Out on 401
privateRequest.interceptors.response.use(
  (response) => response, // If response is successful, return it
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/auth/login" });
    }
    return Promise.reject(error);
  }
);

export default privateRequest;
