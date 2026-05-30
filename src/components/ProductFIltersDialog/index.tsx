import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Typography from "../Typography";
import Input from "../Input";
import Button from "../Button";
import styles from "./ProductFiltersDialog.module.css";
import { useProductFilters } from "../../hooks/useProductFilters";

interface ProductFiltersDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductFiltersDialog({
  isOpen,
  onClose,
}: ProductFiltersDialogProps) {
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useProductFilters();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const handlePriceMinChange = (value: string) => {
    const num = parseInt(value, 10);
    updateFilters({ price_gte: isNaN(num) ? undefined : num });
  };

  const handlePriceMaxChange = (value: string) => {
    const num = parseInt(value, 10);
    updateFilters({ price_lte: isNaN(num) ? undefined : num });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "price" | "label" | "id" | "";
    updateFilters({
      _sort: value ? (value as "price" | "label" | "id") : undefined,
      _order: value ? "asc" : undefined,
    });
  };

  const handleClearAndClose = () => {
    clearFilters();
    onClose();
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div ref={dialogRef} className={styles.dialog}>
        <div className={styles.header}>
          <Typography variant="h2">�� Filtros de Busca</Typography>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {hasActiveFilters && (
          <div className={styles.activeFilters}>
            <Typography variant="p" variantStyle="bodySemiBold">
              Filtros Ativos:
            </Typography>
            <pre className={styles.filtersJson}>
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Faixa de Preço</label>
            <div className={styles.priceRange}>
              <Input
                type="number"
                value={
                  filters.price_gte !== undefined
                    ? String(filters.price_gte)
                    : ""
                }
                onChange={(e) => handlePriceMinChange(e.target.value)}
                placeholder="Mín"
              />
              <span>até</span>
              <Input
                type="number"
                value={
                  filters.price_lte !== undefined
                    ? String(filters.price_lte)
                    : ""
                }
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                placeholder="Máx"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ordenar por</label>
            <select
              value={filters._sort || ""}
              onChange={handleSortChange}
              className={styles.select}
            >
              <option value="">Relevância</option>
              <option value="price">Preço</option>
              <option value="label">Nome (A-Z)</option>
              <option value="id">Mais Recentes</option>
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={handleClearAndClose} text="Limpar Filtros" />
          <Button onClick={onClose} text="Aplicar" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
