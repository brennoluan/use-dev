import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produto/:id" element={<ProductDetailsPage />} />
      <Route path="/carrinho" element={<CartPage />} />
    </Routes>
  );
}
