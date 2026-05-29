import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/query";
import { fetchCategories } from "../requests/categories.request";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}
