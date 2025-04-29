import { ISaleAnalyticsParams } from "@/shared/interface/interface.ts";
import { queryKeys } from "@/shared/query/queryKey.ts";
import { salesService } from "@/shared/service/saleService.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSales = () => {
  return useQuery({
    queryKey: queryKeys.sales.all,
    queryFn: () => salesService.getAll(),
  });
};

export const useSalesAnalytics = ({
  year,
  skip,
  limit,
}: ISaleAnalyticsParams) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, year, skip, limit],
    queryFn: () => salesService.getAnalytics({ year, skip, limit }),
    placeholderData: keepPreviousData,
  });
};
