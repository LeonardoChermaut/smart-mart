import { Page } from "@/components/Page.tsx";
import { FunctionComponent } from "react";
import { ProductsList } from "../components/ProductsList.tsx";

export const ProductsPage: FunctionComponent = () => {
  return (
    <Page>
      <ProductsList />
    </Page>
  );
};
