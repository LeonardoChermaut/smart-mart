import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { SalesPage } from "./pages/SalesPage.tsx";

export const salesAnalyticsRouter: RouteObject[] = [
  {
    path: routes.sales,
    element: <SalesPage />,
  },
];
