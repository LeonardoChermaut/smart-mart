import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-screen bg-indigo-700 text-white shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
          {!collapsed && (
            <NavLink to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">SmartMart</span>
            </NavLink>
          )}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-md hover:bg-indigo-600 transition-colors"
          >
            {collapsed ? <ChevronRight size={30} /> : <ChevronLeft size={30} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <NavItem
            to="/"
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            collapsed={collapsed}
          />

          <NavItem
            to="/products"
            icon={<Package size={20} />}
            label="Products"
            collapsed={collapsed}
          />

          <NavItem
            to="/categories"
            icon={<Tag size={20} />}
            label="Categories"
            collapsed={collapsed}
          />

          <NavItem
            to="/sales"
            icon={<ShoppingCart size={20} />}
            label="Sales"
            collapsed={collapsed}
          />
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  to?: string;
  icon?: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
        } ${collapsed ? "justify-center" : ""}`
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </NavLink>
  );
}
