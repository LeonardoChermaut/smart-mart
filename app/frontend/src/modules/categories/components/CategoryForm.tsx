import { Modal } from "@/components/Modal.tsx";
import { ICategory } from "@/shared/interface/interface.ts";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";

type CategoryFormModalProps = {
  category?: ICategory;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ICategory, "id">) => void;
};

export const CategoryForm: FunctionComponent<CategoryFormModalProps> = ({
  isOpen,
  isLoading,
  category,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<ICategory, "id">>();

  useEffect(() => {
    reset(
      category || {
        name: "",
        discount_percent: 0,
      }
    );
  }, [category, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? "Editar Categoria" : "Adicionar Categoria"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria
          </label>
          <input
            {...register("name", { required: "Nome é obrigatório" })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Digite o nome da categoria"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentual de Desconto (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            {...register("discount_percent", {
              required: "Desconto é obrigatório",
              min: { value: 0, message: "Mínimo é 0%" },
              max: { value: 100, message: "Máximo é 100%" },
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.discount_percent ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.discount_percent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.discount_percent.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors`}
          >
            {isLoading ? "Salvando..." : "Salvar Categoria"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
