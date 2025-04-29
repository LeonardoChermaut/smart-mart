import { queryKeys } from "@/shared/query/queryKey.ts";
import { productService } from "@/shared/service/productService.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProducts = (page = 0, limit = 100) => {
  return useQuery({
    queryKey: queryKeys.products.paginated(page, limit),
    queryFn: () => productService.getAll(page, limit),
    placeholderData: keepPreviousData,
  });
};
