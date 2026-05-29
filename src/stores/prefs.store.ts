type ViewMode = "grid" | "list";

type PrefsState = {
  viewMode: ViewMode;
};

class PrefsStore {
  private state: PrefsState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = {
      viewMode: (localStorage.getItem("viewMode") as ViewMode) || "grid",
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (event.key === "viewMode" && event.newValue) {
          this.state = {
            ...this.state,
            viewMode: event.newValue as ViewMode,
          };
          this.emitChange();
        }
      });
    }
  }

  getSnapshot = (): PrefsState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  setViewMode = (mode: ViewMode) => {
    this.state = { ...this.state, viewMode: mode };
    localStorage.setItem("viewMode", mode);
    this.emitChange();
  };

  private emitChange = (): void => {
    this.listeners.forEach((listener) => listener());
  };
}

export const prefsStore = new PrefsStore();
