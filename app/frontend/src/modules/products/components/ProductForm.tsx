import { BaseButton } from "@/components/BaseButton.tsx";
import { Modal } from "@/components/Modal.tsx";
import { useCategories } from "@/shared/hook/categories/queries.ts";
import { ICategory, IProduct } from "@/shared/interface/interface.ts";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";

type ProductFormModalProps = {
  product?: IProduct;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IProduct, "id">) => void;
};

export const ProductFormModal: FunctionComponent<ProductFormModalProps> = ({
  isOpen,
  isLoading,
  product,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<IProduct, "id">>();

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  useEffect(() => {
    reset(
      product || {
        name: "",
        category_id: undefined,
        base_price: 0,
      }
    );
  }, [product, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Editar Produto" : "Adicionar Produto"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            {...register("name", { required: "Nome é obrigatório" })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Digite o nome do produto"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            {...register("category_id", {
              required: "Selecione uma categoria",
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.category_id ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoadingCategories}
          >
            <option value="">Selecione uma categoria</option>
            {categories?.map((category: ICategory) => (
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Base (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register("base_price", {
              required: "Preço é obrigatório",
              min: { value: 0.01, message: "Preço mínimo é R$ 0,01" },
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.base_price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.base_price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.base_price.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <BaseButton
            variant="secondary"
            title="Cancelar"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          />
          <BaseButton
            type="submit"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            title={isLoading ? "Salvando..." : "Salvar Produto"}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors`}
          />
        </div>
      </form>
    </Modal>
  );
};
