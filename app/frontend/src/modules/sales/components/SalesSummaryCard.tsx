import { ISalesAnalytics } from "@/shared/interface/interface.ts";
import { formatCurrency, getColorProfit } from "@/shared/utils/utils.ts";
import { FunctionComponent } from "react";

type SalesSummaryCardsProps = {
  data: ISalesAnalytics[];
  isLoading: boolean;
};

export const SalesSummaryCard: FunctionComponent<SalesSummaryCardsProps> = ({
  data,
  isLoading,
}) => {
  const totalSales = data?.reduce((sum, item) => sum + item.total_sales, 0);
  const totalQuantitySales = data?.reduce(
    (sum, item) => sum + item.total_quantity,
    0
  );

  const totalProfit = data
    ?.map((item) => item.profit)
    .reduce((sum, item) => sum + item, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 h-24 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Itens Vendidos</h3>
        <p className="text-2xl font-bold">{totalQuantitySales}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Total em Vendas</h3>
        <p className={`text-2xl font-bold ${getColorProfit(totalSales)}`}>
          {formatCurrency(totalSales)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm">Lucro Total</h3>
        <p className={`text-2xl font-bold ${getColorProfit(totalProfit)}`}>
          {formatCurrency(totalProfit)}
        </p>
      </div>
    </div>
  );
};
