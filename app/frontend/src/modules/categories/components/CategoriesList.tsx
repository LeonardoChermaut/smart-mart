import { AlertModal } from "@/components/AlertModal.tsx";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseHeader } from "@/components/BaseHeader.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { WarningMessage } from "@/components/WarningMessage.tsx";
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
        { onSuccess: closeModal }
      );
    }

    if (isCreatingCategory) {
      return createCategory(data, { onSuccess: closeModal });
    }
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhuma categoria encontrada"
      description="Adicione novas categorias para começar."
      icon={PackageX}
    />
  );

  const warningMessage = (
    <WarningMessage>
      <span>
        Todos os produtos{" "}
        <strong>associados a esta categoria serão removidos</strong>.
      </span>
    </WarningMessage>
  );

  return (
    <BaseLayout>
      <BaseHeader title="Gerenciamento de Categorias">
        <BaseButton
          title="Importar CSV"
          variant="secondary"
          onClick={() => openModal("upload")}
          icon={<span className="material-icons">upload</span>}
        />
        <BaseButton
          title="Adicionar Categoria"
          variant="success"
          onClick={() => openModal("create")}
          icon={<span className="material-icons">add</span>}
        />
      </BaseHeader>

      <UploadCSVModal
        title="Importar Categorias"
        description="um arquivo CSV com as categorias"
        isLoading={isUploading}
        isOpen={modalState.type === "upload"}
        onClose={closeModal}
        onUpload={(file) => {
          if (file) {
            uploadCategoryCSV(file, { onSuccess: closeModal });
          }
        }}
      />

      <CategoryForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        onSubmit={handleSubmitCategory}
        isLoading={isCreating || isUpdating}
        category={modalState.data}
      />

      <DataTable
        headers={categoriesListHeaders}
        data={categories || []}
        isLoading={isLoadingCategories}
        emptyDataComponent={emptyDataComponent}
        renderRow={(category: ICategory) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => openModal("edit", category)}
            onDelete={() => openModal("delete", category)}
          />
        )}
      />

      <AlertModal
        isOpen={modalState.type === "delete"}
        title="Confirmar exclusão de categoria"
        variant="warning"
        confirmText="Excluir mesmo assim"
        cancelText="Cancelar"
        onCancel={closeModal}
        message={warningMessage}
        onConfirm={() =>
          deleteCategory(modalState.data!.id, { onSuccess: closeModal })
        }
      />
    </BaseLayout>
  );
};
