import { useLocation } from "react-router-dom";

const routesToNameMap: Record<string, string> = {
  "/": "Dashboard",
  "/categories": "Categorias",
  "/products": "Produtos",
  "/sales": "Vendas",
} as const;

export const TopBar = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">{`${
            routesToNameMap[location.pathname] || null
          }`}</h2>
        </div>
      </div>
    </header>
  );
};
