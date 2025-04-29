import { queryKeys } from "@/shared/query/queryKey.ts";
import { categoryService } from "@/shared/service/categoryService.ts";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.getAll(),
  });
};
