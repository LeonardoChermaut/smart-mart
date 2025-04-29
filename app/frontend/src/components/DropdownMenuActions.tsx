import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu.tsx";

type DropdownMenuActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
  iconSize?: number;
  align?: "start" | "center" | "end";
};

export const DropdownMenuActions: FunctionComponent<
  DropdownMenuActionsProps
> = ({ onEdit, onDelete, className = "", iconSize = 20, align = "end" }) => {
  return (
    <div className="flex justify-start space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 ${className}`}
            aria-label="Menu de ações"
          >
            <MoreVertical size={iconSize} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg py-1"
        >
          <DropdownMenuItem
            onClick={onEdit}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2 text-blue-500" />
            <span>Editar</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
