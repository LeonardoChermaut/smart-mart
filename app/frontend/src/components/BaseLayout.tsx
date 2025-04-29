import { FunctionComponent, ReactNode } from "react";

type BaseLayoutProps = {
  children: ReactNode;
};

export const BaseLayout: FunctionComponent<BaseLayoutProps> = ({
  children,
}) => {
  return <div className="container mx-auto p-4">{children}</div>;
};
