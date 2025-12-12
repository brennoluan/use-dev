import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Product } from "../../common/types/product";
import { PRODUCTS_BASE_URL } from "../../common/constants/endpoints";
import { useCart } from "../../contexts/CartContext";
import StatusHandler from "../../common/utils/statusHandler";
import Typography from "../../components/Typography";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import Styles from "./ProductDetailsPage.module.css";

function ProductDetailsPage() {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(PRODUCTS_BASE_URL)
      .then((response) => {
        const foundProduct = response.data.products.find(
          (product: Product) => product.id.toString() === id
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Produto não encontrado.");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar os detalhes do produto.");
        setIsLoading(false);
      });
  }, [id]);

  return (
    <main className="container">
      <section>
        <div className={Styles.productContainer}>
          <Typography variant="h4">Detalhes do Produto</Typography>

          <StatusHandler isLoading={isLoading} error={error}>
            {product ? (
              <ProductDetail
                id={product.id}
                title={product.label}
                description={product.description}
                price={product.price}
                imageUrl={product.imageSrc}
                colors={product.colors}
                addToCart={addToCart}
              />
            ) : (
              <p>Produto não encontrado.</p>
            )}
          </StatusHandler>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
