import { FunctionComponent } from "react";

type YearSelectProps = {
  selectedYear: string;
  isLoading?: boolean;
  years?: string[];
  label?: string;
  className?: string;
  disabled?: boolean;
  width?: "auto" | "full" | "xs" | "sm" | "md" | "lg" | "xl";
  height?: "sm" | "md" | "lg";
  onYearChange: (year: string) => void;
};

const mappedYearLength = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

const widthClasses = {
  auto: "w-auto",
  full: "w-full",
  xs: "w-20",
  sm: "w-32",
  md: "w-48",
  lg: "w-64",
  xl: "w-80",
} as const;

const heightClasses = {
  sm: "py-1 text-sm",
  md: "py-2 text-base",
  lg: "py-3 text-lg",
} as const;

export const YearSelect: FunctionComponent<YearSelectProps> = ({
  selectedYear,
  onYearChange,
  disabled = false,
  isLoading = false,
  years = mappedYearLength,
  label = "Selecione o ano:",
  className = "",
  width = "sm",
  height = "md",
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor="year-select"
          className={`text-xs ${isLoading ? "opacity-70" : ""}`}
        >
          {label}
        </label>
      )}
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        disabled={disabled || isLoading}
        className={`
          flex items-center justify-center
          px-4 rounded-lg border border-gray-300 shadow-sm
          focus:ring-2 focus:ring-indigo-200
          transition-all duration-200
          ${widthClasses[width]}
          ${heightClasses[height]}
          ${
            isLoading ? "cursor-not-allowed opacity-70 bg-gray-100" : "bg-white"
          }`}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
