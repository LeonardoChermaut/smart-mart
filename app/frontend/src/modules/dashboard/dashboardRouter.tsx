import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage.tsx";

export const dashboardRouter: RouteObject[] = [
  {
    path: routes.dashboard,
    element: <DashboardPage />,
  },
];
