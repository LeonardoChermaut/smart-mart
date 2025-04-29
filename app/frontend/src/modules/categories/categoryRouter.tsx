import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { CategoriesPage } from "./pages/CategoriesPage.tsx";

export const categoryRouter: RouteObject[] = [
  {
    path: routes.categories,
    element: <CategoriesPage />,
  },
];
