import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { ManagementHeader } from "@/components/ManagementHeader.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { useModal } from "@/shared/hook/useModal.ts";

import { AlertModal } from "@/components/AlertModal.tsx";
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

  const handleDelete = (productId: number) => {
    const product = products?.find((cat) => cat.id === productId);
    if (product) {
      openModal("delete", product);
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
        isOpen={modalState.type === "create" || modalState.type === "edit"}
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
            onDelete={() => handleDelete(product.id)}
          />
        )}
        emptyDataComponent={emptyDataComponent}
      />

      <AlertModal
        isOpen={modalState.type === "delete"}
        title="Confirmar exclusão do produto"
        confirmText="Excluir mesmo assim"
        cancelText="Cancelar"
        variant="warning"
        onCancel={closeModal}
        onConfirm={() => {
          if (modalState.data) {
            deleteProduct(modalState.data.id, {
              onSuccess: () => closeModal(),
            });
          }
        }}
        message={
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="text-base font-medium text-destructive">
              Atenção: essa ação não poderá ser desfeita.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Todos as vendas{" "}
                <strong>associadas a este produto serão removidas</strong>.
              </li>
              <li>
                Você perderá{" "}
                <strong>permanentemente os dados relacionados.</strong>
              </li>
            </ul>
            <p className="font-medium text-foreground">
              Tem certeza de que deseja continuar?
            </p>
          </div>
        }
      />
    </BaseLayout>
  );
};
