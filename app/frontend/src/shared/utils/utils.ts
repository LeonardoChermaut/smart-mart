import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const EPSILON = 0.00001;

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const adjustDate = (dateString: string): string => {
  const date = new Date(dateString);
  const adjustedDate = new Date(
    date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
  );

  return adjustedDate.toISOString().split("T")[0];
};

export const useDelay = async (delay: number, callback?: Function) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve();
    }, delay);
  });
};

export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });

export const getColorProfit = (profit: number): string => {
  if (profit > EPSILON) return "text-green-600";
  if (profit < -EPSILON) return "text-red-600";
};
