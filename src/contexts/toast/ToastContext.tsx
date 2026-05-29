import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import Styles from "./ToastContext.module.css";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextProps = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prevState) => prevState.filter((toast) => toast.id !== id));
  };

  const showToast = (message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    const newToast: Toast = {
      id,
      type,
      message,
    };

    setToasts((prevstate) => [...prevstate, newToast]);

    setTimeout(() => {
      setToasts((prevState) => prevState.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={Styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${Styles.toast} ${Styles[`toast${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]}`}
            role="alert"
            aria-live="polite"
          >
            <span className={Styles.toastIcon}>
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "warning" && "⚠"}
              {toast.type === "info" && "ℹ"}
            </span>
            <span className={Styles.toastMessage}>{toast.message}</span>
            <button
              className={Styles.toastClose}
              onClick={() => removeToast(toast.id)}
              aria-label="Fechar notificação"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
