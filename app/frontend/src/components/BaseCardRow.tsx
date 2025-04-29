import { FunctionComponent, ReactNode } from "react";

type BaseCardRowProps = {
  children: ReactNode;
  hoverEffect?: boolean;
  className?: string;
};

export const BaseCardRow: FunctionComponent<BaseCardRowProps> = ({
  children,
  hoverEffect = true,
  className = "",
}) => {
  return (
    <tr
      className={`${
        hoverEffect ? "hover:bg-gray-50 transition-colors" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
};
