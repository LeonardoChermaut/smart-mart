import { RouteObject } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";

export const notFoundRouter: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
