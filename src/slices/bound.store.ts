import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createCartSlice, type CartSlice } from "./cart.slice";

type BoundStore = CartSlice;

const storageChannel =
  typeof window !== "undefined"
    ? new BroadcastChannel("alura-store-sync")
    : null;

export const useBoundStore = create<BoundStore>()(
  devtools(
    persist(
      (...rest) => ({
        ...createCartSlice(...rest),
      }),
      {
        name: "alura-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          const { items } = state;
          return { items };
        },
      },
    ),
    { name: "Alura Store" },
  ),
);

if (storageChannel) {
  storageChannel.onmessage = (event) => {
    if (event.data.type === "STORAGE_UPDATE") {
      const persistedState = localStorage.getItem("alura-store");

      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        useBoundStore.setState(parsed.state);
      }
    }
  };

  useBoundStore.subscribe((state) => {
    const seriazableState = {
      items: state.items,
    };

    storageChannel.postMessage({
      type: "STORAGE_UPDATE",
      state: seriazableState,
    });
  });
}
