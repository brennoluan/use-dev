import type { StateCreator } from "zustand";
import type { Product } from "../common/types/product";

export interface CartSlice {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  hasItem: (productId: number) => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const exists = state.items.find((item) => item.id === product.id);

      if (exists) {
        return state;
      }

      return {
        items: [...state.items, product],
      };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  clearCart: () => set({ items: [] }),
  hasItem: (productId) => {
    return get().items.some((item) => item.id === productId);
  },
});
