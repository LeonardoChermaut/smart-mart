import { BaseCardCell } from "@/components/BaseCardCell.tsx";
import { BaseCardRow } from "@/components/BaseCardRow.tsx";
import { DropdownMenuActions } from "@/components/DropdownMenuActions.tsx";
import { TextCell } from "@/components/TextCell.tsx";
import { useProducts } from "@/shared/hook/products/queries.ts";
import { ISale } from "@/shared/interface/interface.ts";
import { formatCurrency, formatDate } from "@/shared/utils/utils.ts";
import { FunctionComponent } from "react";

type SaleCardProps = {
  sale: ISale;
  onEdit: () => void;
  onDelete: () => void;
};

export const SaleCard: FunctionComponent<SaleCardProps> = ({
  sale,
  onEdit,
  onDelete,
}) => {
  const { data } = useProducts();

  const product = data?.find((product) => product.id === sale.product_id);
  const productName = product
    ? product.name
    : "Produto não encontrado ou não vinculado";

  return (
    <BaseCardRow>
      <BaseCardCell>
        <TextCell>{sale.id}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{productName}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{sale.quantity}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{formatCurrency(Number(sale.total_price))}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{formatDate(sale.date)}</TextCell>
      </BaseCardCell>

      <BaseCardCell align="right">
        <DropdownMenuActions onEdit={onEdit} onDelete={onDelete} />
      </BaseCardCell>
    </BaseCardRow>
  );
};
