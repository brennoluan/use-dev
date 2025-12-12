import type { CSSProperties, MouseEvent, ReactNode } from "react";
import classnames from "classnames";
import Styles from "./Button.module.css";

type ButtonProps = {
  style?: CSSProperties;
  children?: ReactNode;
  text?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: (e: MouseEvent<HTMLElement>) => void;
};

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  text,
  icon,
  onClick,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <button
      style={style}
      className={classnames(Styles.button, Styles[variant], Styles[size])}
      onClick={onClick}
      {...rest}
    >
      <span className={Styles.icon}>{icon}</span>
      <span className={Styles.text}>{text ? text : children}</span>
    </button>
  );
};

export default Button;
