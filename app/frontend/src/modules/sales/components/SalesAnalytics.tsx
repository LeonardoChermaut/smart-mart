import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseCardCell } from "@/components/BaseCardCell.tsx";
import { BaseCardRow } from "@/components/BaseCardRow.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { TextCell } from "@/components/TextCell.tsx";
import { YearSelect } from "@/components/YearSelect.tsx";

import { EmptyData } from "@/components/EmptyData.tsx";
import { useExportSalesAnalytics } from "@/shared/hook/sales/mutations.ts";
import { useSalesAnalytics } from "@/shared/hook/sales/queries.ts";
import { ISalesAnalytics } from "@/shared/interface/interface.ts";
import { formatCurrency, getColorProfit } from "@/shared/utils/utils.ts";
import { FunctionComponent, useState } from "react";
import { SalesChart } from "./SalesChart.tsx";
import { SalesProfitChart } from "./SalesProfitChart.tsx";
import { SalesSummaryCard } from "./SalesSummaryCard.tsx";

const salesAnalyticsHeader = [
  "Mês",
  "Quantidade",
  "Total em Vendas",
  "Margem de Lucro",
  "Lucro/Prejuízo",
] as const;

export const SalesAnalytics: FunctionComponent = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const { mutate: exportSalesAnalytics, isPending: isExportLoading } =
    useExportSalesAnalytics();

  const { data, isLoading, refetch, isFetching } = useSalesAnalytics({
    year: Number(selectedYear),
    skip: null,
    limit: null,
  });

  const handleRefetch = () => refetch();

  const handleExport = () =>
    exportSalesAnalytics({
      year: Number(selectedYear),
    });

  const renderRow = (sale: ISalesAnalytics) => (
    <BaseCardRow key={sale.month}>
      <BaseCardCell>
        <TextCell>{sale.month}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{sale.total_quantity}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{formatCurrency(sale.total_sales)}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{sale?.profit_margin || sale.profit.toFixed(2)}%</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell className={getColorProfit(sale.profit)}>
          {formatCurrency(sale.profit).includes("-")
            ? formatCurrency(sale.profit).replace("-", "")
            : formatCurrency(sale.profit)}
        </TextCell>
      </BaseCardCell>
    </BaseCardRow>
  );

  const emptyDataComponent = (
    <EmptyData
      title="Nenhum dado disponível"
      description="Nenhum dado disponível para o período selecionado"
    />
  );

  return (
    <BaseLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📊 Análise de Vendas
        </h2>

        <div className="flex flex-row xs:flex-row items-start xs:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full xs:w-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Filtrar por ano:
            </span>
            <YearSelect
              label=""
              isLoading={isExportLoading || isLoading || isFetching}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              className="font-semibold text-sm text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
            />
          </div>

          <div className="flex gap-2 w-full xs:w-auto">
            <BaseButton
              title="Exportar"
              variant="secondary"
              isLoading={isExportLoading || isLoading || isFetching}
              disabled={isExportLoading || isLoading || isFetching}
              onClick={handleExport}
              icon={
                <span className="material-icons text-gray-500 text-xs mr-1">
                  download
                </span>
              }
              className="flex-1 xs:flex-none min-w-[100px]"
            />

            <BaseButton
              title="Atualizar"
              variant="secondary"
              isLoading={isExportLoading || isLoading || isFetching}
              disabled={isExportLoading || isLoading || isFetching}
              onClick={handleRefetch}
              icon={
                <span className="material-icons text-gray-500 text-xs mr-1">
                  refresh
                </span>
              }
              className="flex-1 xs:flex-none min-w-[100px]"
            />
          </div>
        </div>
      </div>

      <SalesSummaryCard data={data} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <SalesProfitChart data={data} isLoading={isLoading} />
        <SalesChart data={data} isLoading={isLoading} />
      </div>

      <DataTable
        data={data || []}
        headers={salesAnalyticsHeader}
        isLoading={isLoading}
        emptyDataComponent={emptyDataComponent}
        renderRow={renderRow}
      />
    </BaseLayout>
  );
};
