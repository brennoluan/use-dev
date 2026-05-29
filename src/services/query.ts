import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  products: ["products"],
  productDetail: (id: number) => ["product", "detail", id],
  categories: ["categories"],
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
