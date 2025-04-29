import { AlertModal } from "@/components/AlertModal.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { ManagementHeader } from "@/components/ManagementHeader.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { CategoryCard } from "@/modules/categories/components/CategoryCard.tsx";
import { CategoryForm } from "@/modules/categories/components/CategoryForm.tsx";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useUploadCategoriesCSV,
} from "@/shared/hook/categories/mutations.ts";
import { useCategories } from "@/shared/hook/categories/queries.ts";
import { useModal } from "@/shared/hook/useModal.ts";

import { ICategory, ICategoryPayload } from "@/shared/interface/interface.ts";
import { PackageX } from "lucide-react";
import { FunctionComponent } from "react";

const categoriesListHeaders = ["Id", "Categoria", "Desconto", "Ações"] as const;

export const CategoriesList: FunctionComponent = () => {
  const {
    modalState,
    isOpen,
    isCreating: isCreatingCategory,
    isUpdating: isUpdatingCategory,
    openModal,
    closeModal,
  } = useModal<ICategory>();

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: uploadCategoryCSV, isPending: isUploading } =
    useUploadCategoriesCSV();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleSubmitCategory = (data: ICategoryPayload) => {
    if (isUpdatingCategory) {
      return updateCategory(
        { categoryId: modalState.data!.id, category: data },
        {
          onSuccess: () => closeModal(),
        }
      );
    }

    if (isCreatingCategory) {
      return createCategory(data, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDelete = (categoryId: number) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    if (category) {
      openModal("delete", category);
    }
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhuma categoria encontrada"
      description="Adicione novas categorias para começar."
      icon={PackageX}
    />
  );

  return (
    <BaseLayout>
      <ManagementHeader
        title="Gerenciamento de Categorias"
        primaryButtonText="Adicionar Categoria"
        secondaryButtonText="Importar CSV"
        onPrimaryButtonClick={() => openModal("create")}
        onSecondaryButtonClick={() => openModal("upload")}
      />

      <UploadCSVModal
        title="Importar Categorias"
        description="um arquivo CSV com as categorias"
        isLoading={isUploading}
        isOpen={modalState.type === "upload"}
        onClose={closeModal}
        onUpload={(file) => {
          if (file) {
            uploadCategoryCSV(file, {
              onSuccess: () => closeModal(),
            });
          }
        }}
      />

      <CategoryForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmitCategory}
        isLoading={isCreating || isUpdating}
        category={modalState.data}
      />

      <DataTable
        headers={categoriesListHeaders}
        data={categories || []}
        isLoading={isLoadingCategories}
        renderRow={(category: ICategory) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => openModal("edit", category)}
            onDelete={() => handleDelete(category.id)}
          />
        )}
        emptyDataComponent={emptyDataComponent}
      />

      <AlertModal
        isOpen={isOpen && modalState.type === "delete"}
        title="Confirmar exclusão de categoria"
        variant="warning"
        onConfirm={() => {
          if (modalState.data) {
            deleteCategory(modalState.data.id, {
              onSuccess: () => closeModal(),
            });
          }
        }}
        onCancel={closeModal}
        confirmText="Excluir mesmo assim"
        cancelText="Cancelar"
        message={
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="text-base font-medium text-destructive">
              Atenção: essa ação não poderá ser desfeita.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Todos os produtos{" "}
                <strong>associados a esta categoria serão removidos</strong>.
              </li>
              <li>Você perderá permanentemente os dados relacionados.</li>
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
