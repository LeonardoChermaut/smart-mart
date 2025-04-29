import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { ManagementHeader } from "@/components/ManagementHeader.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { useModal } from "@/shared/hook/useModal.ts";

import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductsCSV,
} from "@/shared/hook/products/mutation.ts";
import { useProducts } from "@/shared/hook/products/queries.ts";
import { IProduct } from "@/shared/interface/interface.ts";
import { PackageX } from "lucide-react";
import { FunctionComponent } from "react";
import { ProductCard } from "./ProductCard.tsx";
import { ProductFormModal } from "./ProductModalForm.tsx";

const productsListHeaders = [
  "Id",
  "Produto",
  "Categoria",
  "Preço Base",
  "Preço Atual",
  "Desconto",
  "Ações",
] as const;

export const ProductsList: FunctionComponent = () => {
  const {
    modalState,
    isOpen,
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

  const handleSubmitProduct = (data: Omit<IProduct, "id">) => {
    if (isCreatingProduct) {
      return createProduct(data, {
        onSuccess: () => closeModal(),
      });
    }

    if (isUpdatingProduct) {
      return updateProduct(
        { ...data, id: modalState.data?.id },
        {
          onSuccess: () => closeModal(),
        }
      );
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(productId);
    }
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhum produto encontrado"
      description="Adicione novos produtos para começar."
      icon={PackageX}
    />
  );

  return (
    <BaseLayout>
      <ManagementHeader
        title="Gerenciamento de Produtos"
        primaryButtonText="Adicionar Produto"
        secondaryButtonText="Importar CSV"
        onPrimaryButtonClick={() => openModal("create")}
        onSecondaryButtonClick={() => openModal("upload")}
      />

      <UploadCSVModal
        title="Importar Produtos"
        isLoading={isUploading}
        onUpload={(file) => {
          if (file) {
            uploadCSV(file, {
              onSuccess: () => closeModal(),
            });
          }
        }}
        description="um arquivo CSV com os produtos"
        isOpen={modalState.type === "upload"}
        onClose={closeModal}
      />

      <ProductFormModal
        product={modalState.data}
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmitProduct}
        isLoading={isCreating || isUpdating}
      />

      <DataTable
        headers={productsListHeaders}
        data={products || []}
        isLoading={isLoadingProducts}
        renderRow={(product: IProduct) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => openModal("edit", product)}
            onDelete={() => handleDeleteProduct(product.id)}
          />
        )}
        emptyDataComponent={emptyDataComponent}
      />
    </BaseLayout>
  );
};
