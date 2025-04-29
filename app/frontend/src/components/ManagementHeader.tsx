import { FunctionComponent, ReactNode } from "react";

type ManagementHeaderProps = {
  children?: ReactNode;
  title: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryButtonClick: () => void;
  onSecondaryButtonClick?: () => void;
};

export const ManagementHeader: FunctionComponent<ManagementHeaderProps> = ({
  children,
  title,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-3">
        {secondaryButtonText && (
          <button
            onClick={onSecondaryButtonClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm
                 bg-indigo-900 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-indigo-900 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {secondaryButtonText}
          </button>
        )}
        <button
          onClick={onPrimaryButtonClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm
                 bg-green-700 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2
                 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-green-900 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {primaryButtonText}
        </button>
        {children}
      </div>
    </div>
  );
};
