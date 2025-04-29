import { FunctionComponent, ReactNode } from "react";

type BaseCardCellProps = {
  children: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  colSpan?: number;
};

const alignment = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const BaseCardCell: FunctionComponent<BaseCardCellProps> = ({
  children,
  align = "left",
  className = "",
  colSpan,
}) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap ${alignment[align]} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
