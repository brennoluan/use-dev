import { useEffect, useState } from "react";
import axios from "axios";
import type { Category } from "../../common/types/category";
import type { Product } from "../../common/types/product";
import {
  CATEGORIES_BASE_URL,
  PRODUCTS_BASE_URL,
} from "../../common/constants/endpoints";
import StatusHandler from "../../common/utils/statusHandler";
import Button from "../../components/Button";
import Categories from "../../components/Categories";
import HeroBanner from "../../components/HeroBanner";
import Newsletter from "../../components/Newsletter";
import ProductList from "../../components/ProductList";
import Typography from "../../components/Typography";

function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  const handleSubscribe = (email: string) => {
    console.log(`Usuário inscrito com o email: ${email}`);
  };

  useEffect(() => {
    axios
      .get(CATEGORIES_BASE_URL)
      .then((response) => {
        setCategories(response.data.categories);
        setIsLoadingCategories(false);
      })
      .catch(() => {
        setCategoriesError("Erro ao carregar categorias.");
        setIsLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(PRODUCTS_BASE_URL)
      .then((response) => {
        setProducts(response.data.products);
        setIsLoadingProducts(false);
      })
      .catch(() => {
        setProductsError("Erro ao carregar produtos.");
        setIsLoadingProducts(false);
      });
  }, []);

  return (
    <>
      <HeroBanner
        backgroundImage="https://raw.githubusercontent.com/gss-patricia/use-dev-assets/refs/heads/main/banner-seceos-tablet.png"
        mainImage="https://raw.githubusercontent.com/gss-patricia/use-dev-assets/8df6d50256e4b270eb794ccbc0314baf2a656211/hero.png"
      >
        <Typography variant="h1">
          Hora de abraçar seu{" "}
          <span style={{ color: "#8fff24" }}>lado geek!</span>
        </Typography>
        <Button
          onClick={() => console.log("ver novidades")}
          size="large"
          text="Ver as novidades!"
        />
      </HeroBanner>
      <main className="container">
        <StatusHandler isLoading={isLoadingCategories} error={categoriesError}>
          <Categories categories={categories} />
        </StatusHandler>

        <StatusHandler isLoading={isLoadingProducts} error={productsError}>
          <ProductList title="Promoções especiais" products={products} />
        </StatusHandler>
      </main>
      <Newsletter onSubscribe={handleSubscribe} />
    </>
  );
}

export default HomePage;
