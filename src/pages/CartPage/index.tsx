import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingBagIcon } from "../../common/icons/ShoppingBagIcon";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import Field from "../../components/Field";
import Typography from "../../components/Typography";
import Styles from "./CartPage.module.css";
import { useReducer, useState } from "react";

type CartState = {
  quantities: Record<number, number>;
  couponCode: string;
  couponDiscount: number;
};

type CartAction =
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "CLEAR_COUPON" };

function cartReducer(state: CartState, action: CartAction) {
  switch (action.type) {
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return state;
      }
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [id]: quantity,
        },
      };
    }
    case "APPLY_COUPON": {
      const couponCode = action.payload.toUpperCase();
      const validCoupons: Record<string, number> = {
        SAVE10: 10,
        SAVE15: 15,
        SAVE20: 20,
      };

      const discount = validCoupons[couponCode] || 0;
      if (!discount) {
        return state;
      }

      return {
        ...state,
        couponCode,
        couponDiscount: discount,
      };
    }
    case "CLEAR_COUPON": {
      return {
        ...state,
        couponCode: "",
        couponDiscount: 0,
      };
    }
    default:
      return state;
  }
}

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  const [couponInput, setCouponInput] = useState("");

  const [state, dispatch] = useReducer(cartReducer, {
    couponCode: "",
    couponDiscount: 0,
    quantities: {},
  });

  const subtotal = cartItems.reduce((accumulator, item) => {
    const quantity = state.quantities[item.id] || 1;
    return accumulator + item.price * quantity;
  }, 0);

  const freight = cartItems.length > 0 ? 8 : 0;

  const discountAmount = subtotal * (state.couponDiscount / 100);

  const total = subtotal - discountAmount + freight;

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;

    dispatch({ type: "APPLY_COUPON", payload: couponInput });
  };

  const handleClearCoupon = () => {
    dispatch({ type: "CLEAR_COUPON" });
    setCouponInput("");
  };

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
            cartItems.map((item) => {
              const quantity = state.quantities[item.id] || 1;
              const itemTotal = item.price * quantity;

              return (
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
                      R$ {item.price.toFixed(2)} (unidade)
                    </Typography>
                    <div className={Styles.quantityControl}>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, quantity - 1)
                        }
                        className={Styles.quantityButton}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>

                      <Typography variantStyle="bodySmallBold">
                        Quantidade: {quantity}
                      </Typography>

                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, quantity + 1)
                        }
                        className={Styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                    <Typography
                      variantStyle="bodySemiBold"
                      style={{ color: "#8fff24" }}
                    >
                      Subtotal: R$ {itemTotal.toFixed(2)}
                    </Typography>
                    <Typography variantStyle="bodySmallBold">
                      Tamanho: único
                    </Typography>
                    <Button onClick={() => removeFromCart(item.id)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              );
            })
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
              buttonText="Aplicar"
              onButtonClick={handleApplyCoupon}
              onChange={(e) => setCouponInput(e.target.value)}
            />
          </div>

          {state.couponCode && (
            <div className={Styles.couponApplied}>
              <Typography variantStyle="bodySmall" style={{ color: "#8fff24" }}>
                ✓ Cupom "{state.couponCode}" aplicado ({state.couponDiscount}%
                OFF)
              </Typography>
              <button
                onClick={handleClearCoupon}
                className={Styles.clearCoupon}
              >
                Remover
              </button>
            </div>
          )}

          <div className={Styles.summaryResume}>
            <Typography variantStyle="bodySmallBold">
              {cartItems.length} Produtos
            </Typography>
            <Typography variantStyle="bodySmallBold">
              R$ {subtotal.toFixed(2)}
            </Typography>

            {state.couponDiscount > 0 && (
              <>
                <Typography variantStyle="bodySmallBold">
                  Desconto ({state.couponDiscount}%):
                </Typography>
                <Typography
                  variantStyle="bodySmallBold"
                  style={{ color: "#8fff24" }}
                >
                  - R$ {discountAmount.toFixed(2)}
                </Typography>
              </>
            )}

            <Typography variantStyle="bodySmallBold">Frete:</Typography>
            <Typography variantStyle="bodySmallBold">
              R$ {freight.toFixed(2)}
            </Typography>
          </div>
          <Divider style={{ borderColor: "#780BF7" }} />
          <div className={Styles.total}>
            <Typography variantStyle="bodyLargeBold">
              <ShoppingBagIcon />
              <span style={{ marginLeft: "4px" }}>Total:</span>
            </Typography>
            <Typography variantStyle="bodyLargeBold" className={Styles.total}>
              R$ {total.toFixed(2)}
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
