import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { ManagementHeader } from "@/components/ManagementHeader.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import {
  useCreateSale,
  useDeleteSale,
  useUpdateSale,
  useUploadSalesCSV,
} from "@/shared/hook/sales/mutations.ts";
import { useSales } from "@/shared/hook/sales/queries.ts";
import { useModal } from "@/shared/hook/useModal.ts";
import { ISale } from "@/shared/interface/interface.ts";
import { PackageX } from "lucide-react";
import { FunctionComponent } from "react";
import { SaleFormModal } from "./SaleForm.tsx";
import { SaleCard } from "./SalesCard.tsx";

const salesListHeaders = [
  "Id",
  "Produto",
  "Quantidade",
  "Valor Total",
  "Data da Venda",
  "Ações",
] as const;

export const SalesList: FunctionComponent = () => {
  const {
    modalState,
    isOpen,
    isCreating: isCreatingSale,
    isUpdating: isUpdatingSale,
    isUploading: isUploadingSale,
    openModal,
    closeModal,
  } = useModal<ISale>();

  const { data: sales, isLoading: isLoadingSales } = useSales();
  const { mutate: createSale, isPending: isCreating } = useCreateSale();
  const { mutate: updateSale, isPending: isUpdating } = useUpdateSale();
  const { mutate: uploadCSV, isPending: isUploading } = useUploadSalesCSV();
  const { mutate: deleteSale } = useDeleteSale();

  const handleSubmitSale = (data: Omit<ISale, "id">) => {
    if (isUpdatingSale) {
      return updateSale(
        { ...data, id: modalState.data?.id },
        {
          onSuccess: () => closeModal(),
        }
      );
    }

    if (isCreatingSale) {
      return createSale(
        { ...data, product_id: data.product_id },
        {
          onSuccess: () => closeModal(),
        }
      );
    }
  };

  const handleDeleteSale = (saleId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      deleteSale(saleId);
    }
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhuma venda encontrada"
      description="Tente adicionar novas vendas ou importar via CSV."
      icon={PackageX}
    />
  );

  return (
    <BaseLayout>
      <ManagementHeader
        title="Gerenciamento de Vendas"
        primaryButtonText="Adicionar Venda"
        secondaryButtonText="Importar CSV"
        onPrimaryButtonClick={() => openModal("create")}
        onSecondaryButtonClick={() => openModal("upload")}
      />

      <UploadCSVModal
        title="Importar Vendas"
        isLoading={isUploading}
        onUpload={(file) => {
          if (file) {
            uploadCSV(file, {
              onSuccess: closeModal,
            });
          }
        }}
        description="um arquivo CSV com as vendas"
        isOpen={isUploadingSale}
        onClose={closeModal}
      />

      <SaleFormModal
        sale={modalState.data}
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmitSale}
        isLoading={isCreating || isUpdating}
      />

      <DataTable
        headers={salesListHeaders}
        data={sales || []}
        isLoading={isLoadingSales}
        renderRow={(sale: ISale) => (
          <SaleCard
            key={sale.id}
            sale={sale}
            onEdit={() => openModal("edit", sale)}
            onDelete={() => handleDeleteSale(sale.id)}
          />
        )}
        emptyDataComponent={emptyDataComponent}
      />
    </BaseLayout>
  );
};
