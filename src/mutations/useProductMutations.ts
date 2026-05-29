import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../requests/products.request";
import type { Product } from "../common/types/product";
import { queryKeys } from "../services/query";
import { useToast } from "../contexts/toast/ToastContext";

export function useProductMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (product: Product) => createProduct(product),
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products });

      const previousProducts = await queryClient.getQueryData<Product[]>(
        queryKeys.products,
      );

      queryClient.setQueryData<Product[]>(queryKeys.products, (old = []) => [
        ...old,
        product,
      ]);

      return { previousProducts };
    },
    onError: (error, _, context) => {
      console.error(error);

      if (context?.previousProducts) {
        queryClient.setQueryData<Product[]>(
          queryKeys.products,
          context.previousProducts,
        );
      }

      showToast("Erro ao criar produto!", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      showToast("Produto adicionado com sucesso!", "success");
    },
  });
}
