import { FunctionComponent } from "react";

type YearSelectProps = {
  selectedYear: string;
  isLoading?: boolean;
  years?: string[];
  label?: string;
  className?: string;
  onYearChange: (year: string) => void;
};

const mappedYearLength = Array.from({ length: 5 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

export const YearSelect: FunctionComponent<YearSelectProps> = ({
  selectedYear,
  onYearChange,
  isLoading = false,
  years = mappedYearLength,
  label = "Selecione o ano:",
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor="year-select"
          className="text-sm font-medium text-gray-600"
        >
          {label}
        </label>
      )}
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        disabled={isLoading}
        className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
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
