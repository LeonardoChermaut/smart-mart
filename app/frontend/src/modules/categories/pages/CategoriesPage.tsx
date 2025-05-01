import { Page } from "@/components/Page.tsx";
import { FunctionComponent } from "react";
import { CategoriesList } from "../components/CategoriesList.tsx";

export const CategoriesPage: FunctionComponent = () => {
  return (
    <Page>
      <CategoriesList />
    </Page>
  );
};
