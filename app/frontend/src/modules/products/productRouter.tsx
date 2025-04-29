import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { ProductsList } from "./components/ProductList.tsx";

export const productRouter: RouteObject[] = [
  {
    path: routes.products,
    element: <ProductsList />,
  },
];
