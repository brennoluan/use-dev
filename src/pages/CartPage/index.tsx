import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingBagIcon } from "../../common/icons/ShoppingBagIcon";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import Field from "../../components/Field";
import Typography from "../../components/Typography";
import Styles from "./CartPage.module.css";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const total = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
  const freight = cartItems.length > 0 ? 8 : 0;

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <main className="container">
      <div className={Styles.cartTitle}>
        <Typography variant="h4">Carrinho de Compras</Typography>
      </div>

      <section className={Styles.cartPage}>
        <div className={Styles.cartItems}>
          <Typography
            variantStyle="bodyLargeBold"
            className={Styles.cartItemTitle}
          >
            Detalhes da compra
          </Typography>
          {cartItems?.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className={Styles.cartItem}>
                <div className={Styles.cartImageContainer}>
                  <img src={item.imageSrc} alt={item.label} />
                </div>
                <div className={Styles.itemDetails}>
                  <div className={Styles.itemDescription}>
                    <Typography variantStyle="h6Small">
                      {item.label}
                    </Typography>
                    <Typography variantStyle="body">
                      {item.description}
                    </Typography>
                  </div>
                  <Typography variantStyle="bodySemiBold">
                    R$ {item.price}
                  </Typography>
                  <Typography variantStyle="bodySmallBold">
                    Quantidade: 1
                  </Typography>
                  <Typography variantStyle="bodySmallBold">
                    Tamanho: único
                  </Typography>
                  <Button onClick={() => removeFromCart(item.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ marginTop: "15px" }}>
              <Typography>Não existem produtos no carrinho.</Typography>
            </div>
          )}
        </div>
        <div className={Styles.cartSummary}>
          <Typography variantStyle="headingSmall">Sumário</Typography>
          <div className={Styles.discount}>
            <Field
              label="Cupom de desconto"
              inputId="cupom"
              inputPlaceholder="Digite o cupom"
              buttonText="Ok"
              onButtonClick={() => {}}
              onChange={() => {}}
            />
          </div>
          <div className={Styles.summaryResume}>
            <Typography variantStyle="bodySmallBold">
              {cartItems.length} Produtos
            </Typography>
            <Typography variantStyle="bodySmallBold">R$ {total}</Typography>
            <Typography variantStyle="bodySmallBold">Frete:</Typography>
            <Typography variantStyle="bodySmallBold">R$ {freight}</Typography>
          </div>
          <Divider style={{ borderColor: "#780BF7" }} />
          <div className={Styles.total}>
            <Typography variantStyle="bodyLargeBold">
              <ShoppingBagIcon />
              <span style={{ marginLeft: "4px" }}>Total:</span>
            </Typography>
            <Typography variantStyle="bodyLargeBold" className={Styles.total}>
              R$ {total + freight}
            </Typography>
          </div>
          <div className={Styles.cartActions}>
            <Button
              onClick={handleRedirect}
              variant="secondary"
              text="Continuar comprando"
            />
            <Button
              onClick={() => console.log("pagamento")}
              text="Ir para pagamento"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
