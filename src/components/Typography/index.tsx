import type { ReactNode, CSSProperties } from "react";
import classNames from "classnames";
import styles from "./Typography.module.css";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
type VariantStyle =
  | "body"
  | "bodyLarge"
  | "bodyLargeBold"
  | "bodySmall"
  | "bodySmallBold"
  | "bodySemiBold"
  | "caption"
  | "headingSmall"
  | "heading"
  | "headingRegular"
  | "headingSemiBold"
  | "h6Small";

type TypographyProps = {
  variant?: Variant;
  variantStyle?: VariantStyle;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const Typography = ({
  variant = "p",
  variantStyle,
  children,
  className,
  style,
}: TypographyProps) => {
  const Tag = variant;

  return (
    <Tag
      className={classNames(
        styles[variant],
        variantStyle && styles[variantStyle],
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default Typography;
