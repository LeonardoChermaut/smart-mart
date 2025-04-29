import { BaseCardCell } from "@/components/BaseCardCell.tsx";
import { BaseCardRow } from "@/components/BaseCardRow.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { ExportButton } from "@/components/ExportButton.tsx";
import { TextCell } from "@/components/TextCell.tsx";
import { YearSelect } from "@/components/YearSelect.tsx";

import { useExportSalesAnalytics } from "@/shared/hook/sales/mutations.ts";
import { useSalesAnalytics } from "@/shared/hook/sales/queries.ts";
import { ISalesAnalytics } from "@/shared/interface/interface.ts";
import { formatCurrency, getColorProfit } from "@/shared/utils/utils.ts";
import { FunctionComponent, useState } from "react";
import { SalesChart } from "./SalesChart.tsx";
import { SalesProfitChart } from "./SalesProfitChart.tsx";
import { SalesSummaryCards } from "./SalesSummaryCardsProps.tsx";

const salesAnalyticsHeader = [
  "Mês",
  "Quantidade",
  "Total em Vendas (R$)",
  "Lucro (R$)",
] as const;

export const SalesAnalytics: FunctionComponent = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const { data, isLoading } = useSalesAnalytics({
    year: Number(selectedYear),
    skip: null,
    limit: null,
  });

  const { mutate: exportSalesAnalytics, isPending: isExportLoading } =
    useExportSalesAnalytics();

  const handleExport = () => {
    exportSalesAnalytics({
      year: Number(selectedYear),
    });
  };

  const renderRow = (sale: ISalesAnalytics) => (
    <BaseCardRow key={sale.month}>
      <BaseCardCell>
        <TextCell variant="medium">{sale.month}</TextCell>
      </BaseCardCell>
      <BaseCardCell>
        <TextCell>{sale.total_quantity}</TextCell>
      </BaseCardCell>
      <BaseCardCell>
        <TextCell variant="semibold">
          {formatCurrency(sale.total_sales)}
        </TextCell>
      </BaseCardCell>
      <BaseCardCell>
        <TextCell variant="semibold" className={getColorProfit(sale.profit)}>
          {formatCurrency(sale.profit).includes("-")
            ? formatCurrency(sale.profit).replace("-", "")
            : formatCurrency(sale.profit)}
        </TextCell>
      </BaseCardCell>
    </BaseCardRow>
  );

  return (
    <BaseLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Análise de Vendas
        </h2>

        <div className="flex items-center space-x-2 ml-4">
          <span className="text-sm text-gray-500">Filtar por ano:</span>
          <YearSelect
            label=""
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="font-semibold text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 px-4 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
          />

          <ExportButton
            isLoading={isExportLoading}
            onClick={handleExport}
            className="font-semibold text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 px-4 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <SalesSummaryCards data={data} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesProfitChart data={data} isLoading={isLoading} />
        <SalesChart data={data} isLoading={isLoading} />
      </div>

      <DataTable
        headers={salesAnalyticsHeader}
        data={data || []}
        isLoading={isLoading}
        emptyDataComponent={
          <div className="p-8 text-center text-gray-500">
            Nenhum dado disponível para o período selecionado
          </div>
        }
        renderRow={renderRow}
      />
    </BaseLayout>
  );
};
