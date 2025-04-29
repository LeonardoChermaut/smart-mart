import { ISalesAnalytics } from "@/shared/interface/interface.ts";
import { formatCurrency } from "@/shared/utils/utils.ts";
import { FunctionComponent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesProfitChartProps = {
  data: ISalesAnalytics[];
  isLoading: boolean;
};

export const SalesProfitChart: FunctionComponent<SalesProfitChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  const processedData = data?.map((item) => ({
    ...item,
    fill: item.profit >= 0 ? "#10B981" : "#EF4444",
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Desempenho Financeiro
        </h3>
        <p className="text-sm text-gray-500">Lucro/Prejuízo por mês</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F3F4F6"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              background: "white",
            }}
            formatter={(value: number) => [
              <span className="font-medium">
                {value >= 0 ? "+" : ""}
                {formatCurrency(value)}
              </span>,

              <span className={value >= 0 ? "text-green-500" : "text-red-500"}>
                {value >= 0 ? "Lucro" : "Prejuízo"}
              </span>,
            ]}
            labelFormatter={(label) => (
              <span className="text-gray-600 font-medium">{label}</span>
            )}
          />
          <Bar
            dataKey="profit"
            name="Resultado"
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
            label={({ x, y, width, value }) => (
              <text
                x={x + width / 2}
                y={y - 8}
                fill={value >= 0 ? "#10B981" : "#EF4444"}
                textAnchor="middle"
                fontSize={11}
                fontWeight={500}
              >
                {value >= 0 ? "+" : ""}
                {formatCurrency(value)}
              </text>
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
