import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AppRoutes } from "./routes";
import ScrollToTop from "./common/utils/ScrollToTop";
import Header from "./components/Header";
import FooterConfig from "./components/Footer/FooterConfig";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Header onSearch={() => {}} />
        <AppRoutes />
        <FooterConfig />
      </Router>
    </CartProvider>
  );
}

export default App;
