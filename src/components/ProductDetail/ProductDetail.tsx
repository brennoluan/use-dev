import { useState } from "react";
import type { Product } from "../../common/types/product";
import { AddCarrinhoIcon } from "../../common/icons/AddCarrinhoIcon";
import Button from "../Button";
import RadioButton from "../RadioButton";
import Typography from "../Typography";
import Styles from "./ProductDetail.module.css";

type ProductDetailProps = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: string[];
  addToCart: (product: Product) => void;
};

function ProductDetail({
  id,
  title,
  description,
  price,
  imageUrl,
  colors,
  addToCart,
}: ProductDetailProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const hasDiscount = price > 25;
  const discountedPrice = hasDiscount ? price * 0.85 : price;
  const savings = price - discountedPrice;

  const promoMessage = hasDiscount
    ? `Economize R$ ${savings.toFixed(2)}!`
    : null;

  const handleAddToCart = () => {
    const product = {
      id,
      label: title,
      description,
      price,
      colors,
      imageSrc: imageUrl,
    };

    addToCart(product);
  };

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <section className={Styles.productDetail}>
      <div className={Styles.imageContainer}>
        <img src={imageUrl} alt={title} className={Styles.productImage} />

        {hasDiscount && <span className={Styles.discountBadge}>15% OFF</span>}
      </div>

      <div className={Styles.detailContainer}>
        <Typography variant="h4">{title}</Typography>
        <Typography variantStyle="bodyLarge">{description}</Typography>
        <Typography variantStyle="headingSemiBold">
          {/* Preço com desconto aplicado */}
          <div className={Styles.priceContainer}>
            {hasDiscount ? (
              <>
                {/* Preço original riscado */}
                <Typography
                  variantStyle="bodyLarge"
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    marginRight: "12px",
                  }}
                >
                  R$ {price.toFixed(2)}
                </Typography>

                {/* Preço com desconto em destaque */}
                <Typography
                  variantStyle="headingSemiBold"
                  style={{ color: "#8fff24" }}
                >
                  R$ {discountedPrice.toFixed(2)}
                </Typography>

                {/* Mensagem de economia */}
                <Typography
                  variantStyle="bodySmall"
                  style={{
                    color: "#8fff24",
                    marginTop: "8px",
                    display: "block",
                  }}
                >
                  🎉 {promoMessage}
                </Typography>
              </>
            ) : (
              /* Preço normal (sem desconto) */
              <Typography variantStyle="headingSemiBold">
                R$ {price.toFixed(2)}
              </Typography>
            )}
          </div>
        </Typography>

        <div className={Styles.radioGroup}>
          {colors.map((color) => (
            <RadioButton
              key={color}
              label={color}
              value={color}
              checked={selectedValue === color}
              onChange={handleRadioChange}
            />
          ))}
        </div>

        <div className={Styles.action}>
          <Button icon={<AddCarrinhoIcon />} onClick={handleAddToCart}>
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
