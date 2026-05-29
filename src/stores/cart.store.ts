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

  getState = (): CartState => {
    return this.state;
  };

  setState = (partial: Partial<CartState>): void => {
    const nextState = { ...this.state, ...partial };
    this.state = nextState;
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
