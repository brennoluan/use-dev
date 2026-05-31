import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useRef } from "react";
import {
  parseSearchParams,
  serializeSearchParams,
} from "../common/utils/search";
import type { ProductSearchParams } from "../common/types/search";

interface UseProductFilters {
  filters: Partial<ProductSearchParams>;
  updateFilters: (newFilters: Partial<ProductSearchParams>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useProductFilters(): UseProductFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  const isUpdating = useRef(false);

  const filters = useMemo(() => {
    return parseSearchParams(searchParams);
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductSearchParams>) => {
      if (isUpdating.current) {
        return;
      }

      try {
        isUpdating.current = true;

        const currentFilters = parseSearchParams(searchParams);
        const mergedFilters = { ...currentFilters, ...newFilters };

        const serialized = serializeSearchParams(mergedFilters);

        setSearchParams(serialized, { replace: true });
      } finally {
        isUpdating.current = false;
      }
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    if (isUpdating.current) {
      return;
    }

    try {
      isUpdating.current = true;

      setSearchParams({}, { replace: false });
    } finally {
      isUpdating.current = false;
    }
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return !!Object.keys(filters).length;
  }, [filters]);

  return {
    clearFilters,
    filters,
    hasActiveFilters,
    updateFilters,
  };
}
