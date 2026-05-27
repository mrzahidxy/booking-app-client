import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { getPrimaryTenantId } from "./session";

export const publicRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const privateRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

const normalizeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const rawMessage =
      error.response?.data?.message ?? error.message ?? "Request failed";
    const message =
      typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
    return Promise.reject(Object.assign(error, { userMessage: message }));
  }
  return Promise.reject(error);
};

// Interceptor to add Authorization header
privateRequest.interceptors.request.use(
  async (config) => {
    const session = await getSession()

    const token = session?.user?.token;
    if (token) {
      const authValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = authValue;
    }

    const tenantId = getPrimaryTenantId(session);
    if (tenantId) {
      config.headers["X-Tenant-Id"] = String(tenantId);
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
    return normalizeError(error);
  }
);

publicRequest.interceptors.response.use(
  (response) => response,
  (error) => normalizeError(error)
);

export default privateRequest;
