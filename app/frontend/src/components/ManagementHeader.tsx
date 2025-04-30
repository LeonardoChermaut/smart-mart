import { FunctionComponent, JSX, ReactNode } from "react";

type ManagementHeaderProps = {
  children?: ReactNode;
  title: string;
  primaryButton: JSX.Element;
  secondaryButton?: JSX.Element;
};

export const ManagementHeader: FunctionComponent<ManagementHeaderProps> = ({
  children,
  title,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-3">
        {primaryButton && primaryButton}

        {secondaryButton && secondaryButton}

        {children}
      </div>
    </div>
  );
};
