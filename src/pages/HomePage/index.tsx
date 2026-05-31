import StatusHandler from "../../common/utils/statusHandler";
import Button from "../../components/Button";
import Categories from "../../components/Categories";
import HeroBanner from "../../components/HeroBanner";
import Newsletter from "../../components/Newsletter";
import ProductList from "../../components/ProductList";
import Typography from "../../components/Typography";
import { useProductsQuery } from "../../queries/useProductsQuery";
import { useCategoriesQuery } from "../../queries/useCategoriesQuery";
import { useState } from "react";
import { useProductFilters } from "../../hooks/useProductFilters";
import styles from "./HomePage.module.css";
import { useProductMutation } from "../../mutations/useProductMutations";
import { ProductFiltersDialog } from "../../components/ProductFIltersDialog";

const newProduct = {
  id: Date.now(),
  label: `Camiseta ${Date.now()}`,
  price: 28,
  colors: ["Bege", "Branca", "Cinza"],
  imageSrc:
    "https://raw.githubusercontent.com/gss-patricia/use-dev-assets/refs/heads/main/cards-produtos/cards-home/desktop-e-tablet/capy.png",
  description: "Camiseta 100% algodão.",
};

function HomePage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { filters, hasActiveFilters } = useProductFilters();

  const handleSubscribe = (email: string) => {
    console.log(`Usuário inscrito com o email: ${email}`);
  };

  const {
    data: categories,
    isPending: isLoadingCategories,
    isError: categoriesError,
  } = useCategoriesQuery();

  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
  } = useProductsQuery(hasActiveFilters ? filters : undefined);

  const { mutate: createProduct } = useProductMutation();

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
        <Button
          onClick={() => createProduct(newProduct)}
          size="large"
          text="Adicionar produto"
        />
      </HeroBanner>
      <main className="container">
        <StatusHandler isLoading={isLoadingCategories} error={categoriesError}>
          <Categories categories={categories || []} />
        </StatusHandler>

        <div className={styles.filtersSection}>
          <Typography variant="h2">Produtos</Typography>
          <div className={styles.filtersButton}>
            <Button onClick={() => setIsFiltersOpen(true)} text="🔍 Filtros" />
            {hasActiveFilters && (
              <span className={styles.filtersBadge}>
                {Object.keys(filters).length}
              </span>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <Typography
              variant="p"
              variantStyle="bodySemiBold"
              className={styles.activeFiltersLabel}
            >
              Filtros ativos:
            </Typography>
            {filters.price_gte !== undefined && (
              <span className={styles.filterChip}>
                Preço mín: R$ {filters.price_gte}
              </span>
            )}
            {filters.price_lte !== undefined && (
              <span className={styles.filterChip}>
                Preço máx: R$ {filters.price_lte}
              </span>
            )}
            {filters._sort && (
              <span className={styles.filterChip}>
                Ordenar: {filters._sort}
              </span>
            )}
          </div>
        )}

        <StatusHandler isLoading={isPendingProducts} error={isErrorProducts}>
          <ProductList title="Promoções especiais" products={products || []} />
        </StatusHandler>
      </main>
      <Newsletter onSubscribe={handleSubscribe} />

      <ProductFiltersDialog
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </>
  );
}

export default HomePage;
