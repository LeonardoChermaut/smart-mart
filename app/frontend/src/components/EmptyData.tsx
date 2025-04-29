import { LucideIcon } from "lucide-react";
import { FunctionComponent } from "react";

type EmptyDataProps = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
};

export const EmptyData: FunctionComponent<EmptyDataProps> = ({
  title = "Nenhum dado encontrado",
  description = "Não encontramos nenhum registro para ser exibido.",
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      {Icon && <Icon className="w-12 h-12 mb-4" />}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm mt-2">{description}</p>
    </div>
  );
};
