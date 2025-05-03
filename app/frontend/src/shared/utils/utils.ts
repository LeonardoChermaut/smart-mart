import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const EPSILON = 0.00001;

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (value: number): string =>
  value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });

export const getColorProfit = (profit: number): string => {
  if (profit > EPSILON) return "text-green-600";
  if (profit < -EPSILON) return "text-red-600";
  return "text-gray-600";
};

export const isCSVFile = (file: File) => file.name.endsWith(".csv");

export function filter<T extends { [key: string]: any }>(
  data: T[],
  filters: Partial<T>
): T[] {
  return data.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true;

      if (typeof value === "string") {
        return item[key].toString().toLowerCase().includes(value.toLowerCase());
      }

      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }

      return item[key] === value;
    })
  );
}
