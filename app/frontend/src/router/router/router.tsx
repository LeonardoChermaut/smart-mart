import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/components/MainLayout.tsx";
import { categoryRouter } from "@/modules/categories/categoryRouter.tsx";
import { dashboardRouter } from "@/modules/dashboard/dashboardRouter.tsx";
import { NotFoundPage } from "@/modules/notfound/pages/NotFoundPage.tsx";
import { productRouter } from "@/modules/products/productRouter.tsx";
import { salesAnalyticsRouter } from "@/modules/sales/salesRouter.tsx";
import { routes } from "./routes.ts";

export const router = createBrowserRouter([
  {
    path: routes.dashboard,
    element: <MainLayout />,
    children: [
      ...dashboardRouter,
      ...productRouter,
      ...categoryRouter,
      ...salesAnalyticsRouter,
    ],
    errorElement: <NotFoundPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
