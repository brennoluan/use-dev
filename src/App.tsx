import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import ScrollToTop from "./common/utils/ScrollToTop";
import Header from "./components/Header";
import FooterConfig from "./components/Footer/FooterConfig";
import { ToastProvider } from "./contexts/toast/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "./services/query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Header onSearch={() => {}} />
          <AppRoutes />
          <FooterConfig />
        </Router>
      </ToastProvider>

      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;
