import { BaseCardCell } from "@/components/BaseCardCell.tsx";
import { BaseCardRow } from "@/components/BaseCardRow.tsx";
import { DropdownMenuActions } from "@/components/DropdownMenuActions.tsx";
import { TextCell } from "@/components/TextCell.tsx";
import { useCategories } from "@/shared/hook/categories/queries.ts";
import { IProduct } from "@/shared/interface/interface.ts";
import { formatCurrency } from "@/shared/utils/utils.ts";
import { FunctionComponent } from "react";

type ProductCardProps = {
  product: IProduct;
  onEdit: () => void;
  onDelete: () => void;
};

export const ProductCard: FunctionComponent<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const { data: categories } = useCategories();
  const category = categories?.find((cat) => cat.id === product.category_id);

  const discountPercent =
    categories?.find((cat) => cat.id === product.category_id)
      ?.discount_percent || 0;

  return (
    <BaseCardRow>
      <BaseCardCell>
        <TextCell>{product.id}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{product.name}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{category?.name || "Sem categoria"}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{formatCurrency(product.base_price)}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{formatCurrency(product.current_price)}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell variant="semibold">{discountPercent}%</TextCell>
      </BaseCardCell>

      <BaseCardCell align="right">
        <DropdownMenuActions onEdit={onEdit} onDelete={onDelete} />
      </BaseCardCell>
    </BaseCardRow>
  );
};
