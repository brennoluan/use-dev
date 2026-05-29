import { Link } from "react-router-dom";
import type { Product } from "../../common/types/product";
import Card from "../Card";
import Typography from "../Typography";
import Styles from "./ProductList.module.css";
import { usePrefs } from "../../hooks/usePrefs";

type ProductListProps = {
  title: string;
  products: Product[];
};

const ProductList = ({ title, products }: ProductListProps) => {
  const { isGridMode, setViewMode } = usePrefs();

  return (
    <section className={Styles.productList}>
      <div className={Styles.header}>
        <Typography variant="h4" className={Styles.title}>
          {title}
        </Typography>

        <div className={Styles.viewControls}>
          <button
            onClick={() => setViewMode("grid")}
            className={`${Styles.viewButton} ${isGridMode ? Styles.active : ""}`}
            aria-label="Visualização em grade"
            title="Grade"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="2" width="7" height="7" />
              <rect x="11" y="2" width="7" height="7" />
              <rect x="2" y="11" width="7" height="7" />
              <rect x="11" y="11" width="7" height="7" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`${Styles.viewButton} ${!isGridMode ? Styles.active : ""}`}
            aria-label="Visualização em lista"
            title="Lista"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="3" width="16" height="2" />
              <rect x="2" y="9" width="16" height="2" />
              <rect x="2" y="15" width="16" height="2" />
            </svg>
          </button>
        </div>
      </div>
      <div className={isGridMode ? Styles.gridContainer : Styles.listContainer}>
        {products.map((product) => (
          <Link to={`/produto/${product.id}`} key={product.id}>
            <Card
              id={product.id}
              key={`product-card-${product.id}`}
              label={product.label}
              price={product.price}
              imageSrc={product.imageSrc}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
