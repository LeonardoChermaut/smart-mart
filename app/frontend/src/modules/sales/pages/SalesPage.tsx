import { Page } from "@/components/Page.tsx";
import { SaleFormModal } from "@/modules/sales/components/SaleForm.tsx";
import { SalesList } from "@/modules/sales/components/SalesList.tsx";
import { useCreateSale } from "@/shared/hook/sales/mutations.ts";
import { useModal } from "@/shared/hook/useModal.ts";
import { FunctionComponent } from "react";

export const SalesPage: FunctionComponent = () => {
  const { isOpen, closeModal } = useModal();
  const { mutate: createSale } = useCreateSale();

  return (
    <Page>
      <SalesList />
      <SaleFormModal
        onSubmit={(data) => createSale(data)}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </Page>
  );
};
