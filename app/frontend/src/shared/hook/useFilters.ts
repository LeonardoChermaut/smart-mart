import { useState } from "react";

type FilterProps<T> = {
  filters: T;
  updateFilter: (key: keyof T, value: T[keyof T]) => void;
  resetFilters: () => void;
};

export const useFilters = <T extends Record<string, any>>(
  initialState: T
): FilterProps<T> => {
  const [filters, setFilters] = useState<T>(initialState);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(initialState);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};
