import { BaseButton } from "@/components/BaseButton.tsx";
import { useCategories } from "@/shared/hook/categories/queries.ts";
import { FunctionComponent } from "react";

type ProductFilterProps = {
  categoryId: number;
  searchQuery: string;
  isLoading: boolean;
  disabled: boolean;
  onCategoryChange: (categoryId: number) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
};

export const ProductsFilters: FunctionComponent<ProductFilterProps> = ({
  categoryId,
  searchQuery,
  isLoading,
  disabled,
  onCategoryChange,
  onSearchChange,
  onReset,
}) => {
  const { data: categories } = useCategories();

  const isInputDisabled = disabled || isLoading;

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted rounded-lg">
      <div className="flex-1 relative">
        <input
          placeholder="Pesquisar produtos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isInputDisabled}
          className={`w-full p-2 pl-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isInputDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
        <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
          search
        </span>
      </div>

      <div className="w-full md:w-64">
        <select
          value={categoryId ?? ""}
          onChange={(e) =>
            onCategoryChange(e.target.value ? Number(e.target.value) : null)
          }
          disabled={isInputDisabled}
          className={`w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isInputDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <option value="">Todas as categorias</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <BaseButton
          variant="secondary"
          onClick={onReset}
          title="Limpar filtros"
          icon={<span className="material-icons">clear</span>}
          disabled={isInputDisabled}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
