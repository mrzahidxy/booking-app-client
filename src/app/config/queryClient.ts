import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      retry: 2, // Retry failed queries twice
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});

export default queryClient;
