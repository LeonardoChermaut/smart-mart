export const queryKeys = {
  products: {
    all: ["products"] as const,
    paginated: (page: number, limit: number) =>
      [...queryKeys.products.all, "paginated", page, limit] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  sales: {
    all: ["sales"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    byYear: (year?: number) => [...queryKeys.analytics.all, year] as const,
  },
};
