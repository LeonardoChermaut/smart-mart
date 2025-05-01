import { Page } from "@/components/Page.tsx";
import { SalesList } from "@/modules/sales/components/SalesList.tsx";
import { FunctionComponent } from "react";

export const SalesPage: FunctionComponent = () => {
  return (
    <Page>
      <SalesList />
    </Page>
  );
};
