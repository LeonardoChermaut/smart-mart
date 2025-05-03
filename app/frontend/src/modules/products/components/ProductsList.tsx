import { BaseHeader } from "@/components/BaseHeader.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { useModal } from "@/shared/hook/useModal.ts";

import { AlertModal } from "@/components/AlertModal.tsx";
import { BaseButton } from "@/components/BaseButton.tsx";
import { WarningMessage } from "@/components/WarningMessage.tsx";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductsCSV,
} from "@/shared/hook/products/mutation.ts";
import { useProducts } from "@/shared/hook/products/queries.ts";
import { useFilters } from "@/shared/hook/useFilters.ts";
import { IProduct, IProductListFilter } from "@/shared/interface/interface.ts";
import { filter } from "@/shared/utils/utils.ts";
import { PackageX } from "lucide-react";
import { FunctionComponent, useMemo } from "react";
import { ProductCard } from "./ProductCard.tsx";
import { ProductForm } from "./ProductForm.tsx";
import { ProductsFilters } from "./ProductsFilters.tsx";

const productsListHeaders = [
  "Id",
  "Produto",
  "Descrição",
  "Categoria",
  "Preço Base",
  "Preço Atual",
  "Desconto",
  "Ações",
] as const;

export const ProductsList: FunctionComponent = () => {
  const {
    modalState,
    isCreating: isCreatingProduct,
    isUpdating: isUpdatingProduct,
    openModal,
    closeModal,
  } = useModal<IProduct>();

  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: uploadCSV, isPending: isUploading } = useUploadProductsCSV();
  const { mutate: deleteProduct } = useDeleteProduct();

  const { filters, updateFilter, resetFilters } =
    useFilters<IProductListFilter>({
      categoryId: null,
      searchQuery: "",
    });

  const filteredProducts: IProduct[] = useMemo(() => {
    if (!products) return [];

    return filter(products, {
      name: filters.searchQuery,
      category_id: filters.categoryId,
    });
  }, [products, filters.searchQuery, filters.categoryId]);

  const handleSubmitProduct = (data: Omit<IProduct, "id">) => {
    if (isCreatingProduct) {
      return createProduct(data, { onSuccess: closeModal });
    }

    if (isUpdatingProduct) {
      return updateProduct(
        { ...data, id: modalState.data?.id },
        { onSuccess: closeModal }
      );
    }
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhum produto encontrado"
      description="Adicione novos produtos para começar."
      icon={PackageX}
    />
  );

  const warningMessage = (
    <WarningMessage>
      <span>
        Todos as vendas{" "}
        <strong>associadas a este produto serão removidas</strong>.
      </span>
    </WarningMessage>
  );

  return (
    <BaseLayout>
      <BaseHeader title="Gerenciamento de Produtos">
        <BaseButton
          title="Importar CSV"
          variant="secondary"
          onClick={() => openModal("upload")}
          icon={<span className="material-icons">upload</span>}
        />
        <BaseButton
          title="Adicionar Produto"
          variant="success"
          onClick={() => openModal("create")}
          icon={<span className="material-icons">add</span>}
        />
      </BaseHeader>

      <ProductsFilters
        isLoading={isLoadingProducts}
        disabled={isLoadingProducts}
        categoryId={filters.categoryId || 0}
        searchQuery={filters.searchQuery}
        onReset={resetFilters}
        onSearchChange={(query) => updateFilter("searchQuery", query)}
        onCategoryChange={(categoryId) =>
          updateFilter("categoryId", categoryId)
        }
      />

      <UploadCSVModal
        isOpen={modalState.type === "upload"}
        isLoading={isUploading}
        title="Importar Produtos"
        description="um arquivo CSV com os produtos"
        onClose={closeModal}
        onUpload={(file) => {
          if (file) {
            uploadCSV(file, { onSuccess: closeModal });
          }
        }}
      />

      <ProductForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        product={modalState.data}
        onClose={closeModal}
        onSubmit={handleSubmitProduct}
        isLoading={isCreating || isUpdating}
      />

      <DataTable
        headers={productsListHeaders}
        data={filteredProducts}
        isLoading={isLoadingProducts}
        emptyDataComponent={emptyDataComponent}
        renderRow={(product: IProduct) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => openModal("edit", product)}
            onDelete={() => openModal("delete", product)}
          />
        )}
      />

      <AlertModal
        isOpen={modalState.type === "delete"}
        title="Confirmar exclusão do produto"
        confirmText="Excluir mesmo assim"
        cancelText="Cancelar"
        variant="warning"
        onCancel={closeModal}
        message={warningMessage}
        onConfirm={() =>
          deleteProduct(modalState.data.id, { onSuccess: closeModal })
        }
      />
    </BaseLayout>
  );
};
