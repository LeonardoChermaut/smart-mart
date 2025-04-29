import { ISalesAnalytics } from "@/shared/interface/interface.ts";
import { formatCurrency } from "@/shared/utils/utils.ts";
import { FunctionComponent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesChartProps = {
  data: ISalesAnalytics[];
  isLoading: boolean;
};

export const SalesChart: FunctionComponent<SalesChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Evolução de Vendas
        </h3>
        <p className="text-sm text-gray-500">
          Performance mensal em reais (R$)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
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
              <span className="font-medium">{formatCurrency(value)}</span>,
              "Total em Vendas",
            ]}
            labelFormatter={(label) => (
              <span className="text-gray-600 font-medium">{label}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="total_sales"
            name="Total em vendas (R$)"
            stroke="#6366F1"
            strokeWidth={2.5}
            dot={{
              stroke: "#6366F1",
              strokeWidth: 2,
              fill: "#FFFFFF",
              r: 4,
            }}
            activeDot={{
              stroke: "#6366F1",
              strokeWidth: 2,
              fill: "#FFFFFF",
              r: 6,
            }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
