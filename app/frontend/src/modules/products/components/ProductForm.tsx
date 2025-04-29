import { useCategories } from "@/shared/hook/useReactQuery.ts";
import { IProduct } from "@/shared/interface/interface.ts";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";

type ProductFormProps = {
  initialData?: Partial<IProduct>;
  isLoading: boolean;
  onSubmit: (data: Omit<IProduct, "id">) => void;
};

export const ProductForm: FunctionComponent<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<IProduct, "id">>({
    defaultValues: initialData,
  });
  const { data: categories } = useCategories();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          {...register("name", { required: "Nome é obrigatório" })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.name ? "border-red-500" : "border"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          {...register("category_id", { required: "Categoria é obrigatória" })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.category_id ? "border-red-500" : "border"
          }`}
        >
          <option value="">Selecione uma categoria</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço Base (R$)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("base_price", {
            required: "Preço é obrigatório",
            min: { value: 0.01, message: "Preço deve ser maior que zero" },
          })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.base_price ? "border-red-500" : "border"
          }`}
        />
        {errors.base_price && (
          <p className="mt-1 text-sm text-red-600">
            {errors.base_price.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            isLoading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};
