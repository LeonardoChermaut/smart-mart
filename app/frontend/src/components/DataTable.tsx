import { ReactNode } from "react";
import { Skeletons } from "./Skeletons.tsx";

type DataTableProps<T> = {
  data: T[];
  headers: readonly string[];
  isLoading: boolean;
  emptyDataComponent: ReactNode;
  className?: string;
  renderRow: (item: T) => ReactNode;
};

export const DataTable = <T,>({
  headers,
  data,
  isLoading,
  emptyDataComponent,
  renderRow,
  className = "",
}: DataTableProps<T>) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 ${className}`}
    >
      {isLoading && <Skeletons skeletons={data?.length || 5} />}

      {data?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => renderRow(item))}
            </tbody>
          </table>
        </div>
      )}

      {data?.length === 0 && !isLoading && emptyDataComponent}
    </div>
  );
};
