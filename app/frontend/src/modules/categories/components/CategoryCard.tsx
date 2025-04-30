import { BaseCardCell } from "@/components/BaseCardCell.tsx";
import { BaseCardRow } from "@/components/BaseCardRow.tsx";
import { DropdownMenuActions } from "@/components/DropdownMenuActions.tsx";
import { TextCell } from "@/components/TextCell.tsx";
import { ICategory } from "@/shared/interface/interface.ts";
import { FunctionComponent } from "react";

type CategoryCardProps = {
  category: ICategory;
  onEdit: () => void;
  onDelete: () => void;
};

export const CategoryCard: FunctionComponent<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <BaseCardRow>
      <BaseCardCell>
        <TextCell>{category.id}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>{category.name}</TextCell>
      </BaseCardCell>

      <BaseCardCell>
        <TextCell>
          {category.discount_percent > 0
            ? `${category.discount_percent}%`
            : "Sem desconto"}
        </TextCell>
      </BaseCardCell>

      <BaseCardCell align="right">
        <DropdownMenuActions onEdit={onEdit} onDelete={onDelete} />
      </BaseCardCell>
    </BaseCardRow>
  );
};
