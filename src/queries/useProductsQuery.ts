import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/query";
import { fetchProductById, fetchProducts } from "../requests/products.request";
import type { ProductSearchParams } from "../common/types/search";

export function useProductsQuery(filters?: Partial<ProductSearchParams>) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => fetchProducts(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useProductDetailQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.productDetail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}
