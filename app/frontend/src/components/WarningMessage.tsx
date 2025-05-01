import { FunctionComponent, JSX } from "react";

type WarningMessageProps = {
  children?: JSX.Element | string;
};

export const WarningMessage: FunctionComponent<WarningMessageProps> = ({
  children,
}) => {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p className="text-base font-medium text-destructive">
        Atenção: essa ação não poderá ser desfeita.
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          {children ||
            "Essa ação pode causar perda de dados ou afetar o funcionamento do sistema."}
        </li>
        <li>Você perderá permanentemente os dados relacionados.</li>
      </ul>
      <p className="font-medium text-foreground">
        Tem certeza de que deseja continuar?
      </p>
    </div>
  );
};
