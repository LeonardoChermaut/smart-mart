import { FunctionComponent, ReactNode } from "react";

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout: FunctionComponent<BaseLayoutProps> = ({
  children,
}) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
      {children}
    </div>
  );
};
