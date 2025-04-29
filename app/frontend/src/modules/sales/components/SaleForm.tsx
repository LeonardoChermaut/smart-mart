import { Modal } from "@/components/Modal.tsx";
import { useProducts } from "@/shared/hook/products/queries.ts";
import { IProduct, ISale } from "@/shared/interface/interface.ts";
import { formatCurrency, formatDate } from "@/shared/utils/utils.ts";
import { Edit } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SaleFormModalProps = {
  sale?: ISale;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ISale, "id">) => void;
};

export const SaleFormModal: FunctionComponent<SaleFormModalProps> = ({
  isOpen,
  isLoading,
  sale,
  onClose,
  onSubmit,
}) => {
  const [isTotalEditable, setIsTotalEditable] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<ISale, "id">>();

  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const productId = watch("product_id");
  const quantity = watch("quantity") || 1;

  const getProductPrice = (id: string) => {
    if (!id) {
      return 0;
    }

    const selectedProduct = products?.find((p) => p.id === Number(id));
    return selectedProduct?.current_price || 0;
  };

  useEffect(() => {
    const price = getProductPrice(String(productId));
    const total = price * quantity;
    setValue("total_price", total);
  }, [productId, quantity, setValue]);

  useEffect(() => {
    setIsTotalEditable(false);

    reset(
      sale || {
        product_id: undefined,
        quantity: 1,
        total_price: 0,
        date: formatDate(new Date().toString()),
      }
    );
  }, [sale, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sale ? "Editar Venda" : "Adicionar Venda"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produto
          </label>
          <select
            {...register("product_id", { required: "Selecione um produto" })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.product_id ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoadingProducts}
          >
            <option value="">Selecione um produto</option>
            {products?.map((product: IProduct) => (
              <option key={product.id} value={product.id}>
                {product.name} - ({formatCurrency(product.current_price)})
              </option>
            ))}
          </select>
          {errors.product_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.product_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            min="1"
            defaultValue={sale?.quantity || 1}
            {...register("quantity", {
              required: "Quantidade é obrigatória",
              min: { value: 1, message: "Quantidade mínima é 1" },
              valueAsNumber: true,
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor Total (R$)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={watch("total_price")?.toFixed(2) || "0.00"}
              {...register("total_price", {
                required: "Valor é obrigatório",
                valueAsNumber: true,
              })}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.total_price ? "border-red-500" : "border-gray-300"
              } ${!isTotalEditable ? "bg-gray-100" : ""}`}
              disabled={!isTotalEditable}
              readOnly={!isTotalEditable}
            />
            <button
              type="button"
              onClick={() => setIsTotalEditable(!isTotalEditable)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {!isTotalEditable && <Edit className="h-5 w-5" />}
            </button>
          </div>
          {errors.total_price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.total_price.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data da Venda
          </label>
          <input
            type="date"
            {...register("date", { required: "Data da venda é obrigatória" })}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
            {isLoading ? "Salvando..." : "Salvar Venda"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
