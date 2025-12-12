import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { LogoIcon } from "../../common/icons/LogoIcon";
import { CarrinhoIcon } from "../../common/icons/CarrinhoIcon";
import { PerfilIcon } from "../../common/icons/PerfilIcon";
import { SearchIcon } from "../../common/icons/SearchIcon";
import Input from "../Input";
import Typography from "../Typography";
import Styles from "./Header.module.css";

type HeaderProps = {
  onSearch: (query: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
  const { cartCount } = useCart();
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const handleSearch = (): void => {
    onSearch(query);
  };

  return (
    <header className={Styles.header}>
      <div className={Styles.headerInner}>
        <div className={Styles.logo}>
          <Link to="/">
            <LogoIcon />
          </Link>
        </div>
        <div className={Styles.options}>
          <nav className={Styles.nav}>
            <ul>
              <li>
                <a className="body-large-regular" href="/about">
                  Sobre nós
                </a>
              </li>
            </ul>
          </nav>
          <div className={Styles.searchContainer}>
            <Input
              variant="secondary"
              value={query}
              onChange={handleInputChange}
              placeholder="O que você procura?"
              icon={<SearchIcon />}
            />
            <button onClick={handleSearch}>
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className={Styles.userActions}>
            <a href="#">Login</a>
            <a href="#">
              <PerfilIcon />
            </a>
            <Link
              to="/carrinho"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <CarrinhoIcon />
              <Typography variantStyle="bodySmall">({cartCount})</Typography>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
