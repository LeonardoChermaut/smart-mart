import { AlertModal } from "@/components/AlertModal.tsx";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseHeader } from "@/components/BaseHeader.tsx";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { DataTable } from "@/components/DataTable.tsx";
import { EmptyData } from "@/components/EmptyData.tsx";
import { UploadCSVModal } from "@/components/UploadModal.tsx";
import { WarningMessage } from "@/components/WarningMessage.tsx";
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
import { SaleCard } from "./SaleCard.tsx";
import { SaleForm } from "./SaleForm.tsx";

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
          onSuccess: closeModal,
        }
      );
    }

    if (isCreatingSale) {
      return createSale(
        { ...data, product_id: data.product_id },
        {
          onSuccess: closeModal,
        }
      );
    }
  };

  const handleUpload = (file: File) => {
    if (!file) {
      return;
    }

    return uploadCSV(file, {
      onSuccess: closeModal,
    });
  };

  const emptyDataComponent = (
    <EmptyData
      title="Nenhuma venda encontrada"
      description="Tente adicionar novas vendas ou importar via CSV."
      icon={PackageX}
    />
  );

  const warningMessage = (
    <WarningMessage>
      <li>
        Todas as vendas <strong>serão apagadas permanentemente</strong>.
      </li>
    </WarningMessage>
  );

  return (
    <BaseLayout>
      <BaseHeader
        title="Gerenciamento de Vendas"
        primaryButton={
          <BaseButton
            title="Importar CSV"
            variant="secondary"
            onClick={() => openModal("upload")}
            icon={<span className="material-icons">upload</span>}
          />
        }
        secondaryButton={
          <BaseButton
            title="Adicionar Venda"
            variant="success"
            onClick={() => openModal("create")}
            icon={<span className="material-icons">add</span>}
          />
        }
      />

      <UploadCSVModal
        title="Importar Vendas"
        description="um arquivo CSV com as vendas"
        onClose={closeModal}
        onUpload={handleUpload}
        isLoading={isUploading}
        isOpen={isUploadingSale}
      />

      <SaleForm
        sale={modalState.data}
        isOpen={modalState.type === "create" || modalState.type === "edit"}
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
            onDelete={() => openModal("delete", sale)}
          />
        )}
        emptyDataComponent={emptyDataComponent}
      />

      <AlertModal
        isOpen={modalState.type === "delete"}
        title="Confirmar exclusão de venda"
        confirmText="Excluir mesmo assim"
        cancelText="Cancelar"
        variant="warning"
        onCancel={closeModal}
        message={warningMessage}
        onConfirm={() =>
          deleteSale(modalState.data.id, { onSuccess: closeModal })
        }
      />
    </BaseLayout>
  );
};
