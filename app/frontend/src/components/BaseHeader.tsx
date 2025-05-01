import { FunctionComponent, ReactNode } from "react";

type BaseHeaderProps = {
  children?: ReactNode;
  title: string;
};

export const BaseHeader: FunctionComponent<BaseHeaderProps> = ({
  children,
  title,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-3">{children && children}</div>
    </div>
  );
};
