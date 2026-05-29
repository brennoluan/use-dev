import type { Category } from "../common/types/category";
import { api } from "../services/api";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories");
  return data;
}
