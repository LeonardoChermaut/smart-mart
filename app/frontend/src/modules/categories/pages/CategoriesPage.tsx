import { Page } from "@/components/Page.tsx";
import { useCreateCategory } from "@/shared/hook/categories/mutations.ts";
import { CategoryCreatePayload } from "@/shared/interface/interface.ts";
import { useState } from "react";
import { CategoriesList } from "../components/CategoriesList.tsx";
import { CategoryForm } from "../components/CategoryForm.tsx";

export const CategoriesPage = () => {
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const { mutate: createCategory, isPending: isLoading } = useCreateCategory();

  const handleSubmit = (categoryData: CategoryCreatePayload) => {
    createCategory(categoryData, {
      onSuccess: () => setFormOpen(false),
    });
  };

  return (
    <Page>
      <CategoriesList />

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Page>
  );
};
