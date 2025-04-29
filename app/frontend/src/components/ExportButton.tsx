import { FunctionComponent } from "react";

type ExportButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
};

export const ExportButton: FunctionComponent<ExportButtonProps> = ({
  onClick,
  isLoading = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm
                 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                 ${
                   isLoading ? "opacity-70 cursor-not-allowed" : ""
                 } ${className}`}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}
      <span>{isLoading ? "Exportando..." : "Exportar Dados"}</span>
    </button>
  );
};
