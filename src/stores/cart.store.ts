import type { Product } from "../common/types/product";

export type CartState = {
  items: Product[];
  totalItems: number;
};

type Listener = () => void;

class CartStore {
  private state: CartState = {
    items: [],
    totalItems: 0,
  };

  private listeners = new Set<Listener>();

  private channel: BroadcastChannel | null = null;

  private isExternalUpdate = false;

  private readonly STORAGE_KEY = "cart-store";

  private readonly CHANNEL_NAME = "cart-sync";

  constructor() {
    this.loadFromStorage();

    if (typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(this.CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<CartState>) => {
        this.isExternalUpdate = true;
        this.state = event.data;
        this.listeners.forEach((listener) => listener());
        this.isExternalUpdate = false;
      };
    } else {
      console.error("BroadcastChannel is not supported in this browser.");
    }
  }

  private loadFromStorage = (): void => {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        this.state = parsed;
      }
    } catch (error) {
      console.error(error);
    }
  };

  private saveToStorage = (): void => {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error(error);
    }
  };

  private syncWithOtherTabs = (): void => {
    if (!this.isExternalUpdate && this.channel) {
      this.channel.postMessage(this.state);
    }
  };

  getState = (): CartState => {
    return this.state;
  };

  setState = (partial: Partial<CartState>): void => {
    const nextState = { ...this.state, ...partial };
    this.state = nextState;
    this.saveToStorage();
    this.syncWithOtherTabs();
    this.listeners.forEach((listener) => listener());
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  addItem = (product: Product): void => {
    const exists = this.state.items.find((item) => item.id === product.id);
    if (exists) return;

    this.setState({
      items: [...this.state.items, product],
      totalItems: this.state.totalItems + 1,
    });
  };

  removeItem = (id: number): void => {
    const filteredItems = this.state.items.filter((item) => item.id !== id);
    this.setState({
      items: filteredItems,
      totalItems: filteredItems.length,
    });
  };

  clearCart = (): void => {
    this.setState({
      items: [],
      totalItems: 0,
    });
  };
}

export const cartStore = new CartStore();
