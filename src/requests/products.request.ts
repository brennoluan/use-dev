import type { Product } from "../common/types/product";
import { api } from "../services/api";

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function fetchProductById(id: string | number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(product: Product): Promise<Product> {
  const { data } = await api.post<Product>("/products", product);
  return data;
}

// const newProduct: Product = {
//   id: Date.now(),
//   label: `Camiseta ${Date.now()}`,
//   price: 28,
//   colors: ["Bege", "Branca", "Cinza"],
//   imageSrc:
//     "https://raw.githubusercontent.com/gss-patricia/use-dev-assets/refs/heads/main/cards-produtos/cards-home/desktop-e-tablet/capy.png",
//   description: "Camiseta 100% algodão.",
// };
