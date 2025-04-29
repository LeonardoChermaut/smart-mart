import { routes } from "@/router/router/routes.ts";
import { RouteObject } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";

export const homeRouter: RouteObject[] = [
  {
    path: routes.home,
    element: <HomePage />,
  },
];
