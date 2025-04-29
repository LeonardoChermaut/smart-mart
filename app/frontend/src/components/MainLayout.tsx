import { FunctionComponent, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";
import { TopBar } from "./TopBar.tsx";

type MainLayoutProps = {
  children?: ReactNode;
};

export const MainLayout: FunctionComponent<MainLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};
