import { Page } from "@/components/Page.tsx";
import { useCreateProduct } from "@/shared/hook/products/mutation.ts";
import { useState } from "react";
import { ProductFormModal } from "../components/ProductForm.tsx";
import { ProductsList } from "../components/ProductList.tsx";

export const ProductsPage = () => {
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const { mutate: createProduct, isPending: isLoading } = useCreateProduct();

  return (
    <Page>
      <ProductsList />

      <ProductFormModal
        isOpen={isFormOpen}
        isLoading={isLoading}
        onClose={() => setFormOpen(false)}
        onSubmit={(productData) => {
          createProduct(productData);
          setFormOpen(false);
        }}
      />
    </Page>
  );
};
