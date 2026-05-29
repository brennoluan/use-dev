import { useSyncExternalStore } from "react";
import { cartStore, type CartState } from "../stores/cart.store";

export function useCartStore<T>(selector: (state: CartState) => T): T {
  return useSyncExternalStore(cartStore.subscribe, () =>
    selector(cartStore.getState()),
  );
}
