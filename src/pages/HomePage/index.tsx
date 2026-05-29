import StatusHandler from "../../common/utils/statusHandler";
import Button from "../../components/Button";
import Categories from "../../components/Categories";
import HeroBanner from "../../components/HeroBanner";
import Newsletter from "../../components/Newsletter";
import ProductList from "../../components/ProductList";
import Typography from "../../components/Typography";
import { useProductsQuery } from "../../queries/useProductsQuery";
import { useCategoriesQuery } from "../../queries/useCategoriesQuery";
import { useProductMutation } from "../../mutations/useProductMutations";

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
  const handleSubscribe = (email: string) => {
    console.log(`Usuário inscrito com o email: ${email}`);
  };

  const {
    data: categories,
    isPending: isPendingCategories,
    isError: isErrorCategories,
  } = useCategoriesQuery();

  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
  } = useProductsQuery();

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
        <StatusHandler
          isLoading={isPendingCategories}
          error={isErrorCategories}
        >
          <Categories categories={categories || []} />
        </StatusHandler>

        <StatusHandler isLoading={isPendingProducts} error={isErrorProducts}>
          <ProductList title="Promoções especiais" products={products || []} />
        </StatusHandler>
      </main>
      <Newsletter onSubscribe={handleSubscribe} />
    </>
  );
}

export default HomePage;
