import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { ProductsList } from "./components/ProductsList.tsx";

export const productRouter: RouteObject[] = [
  {
    path: routes.products,
    element: <ProductsList />,
  },
];
