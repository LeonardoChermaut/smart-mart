import { FunctionComponent, ReactNode } from "react";

type TextCellProps = {
  children: ReactNode;
  variant?: "normal" | "medium" | "bold" | "semibold";
  color?: "default" | "primary" | "success" | "warning" | "error" | "custom";
  className?: string;
};

const variantClasses = {
  normal: "text-sm",
  medium: "text-sm font-medium",
  bold: "text-sm font-bold",
  semibold: "text-sm font-semibold",
} as const;

const colorClasses = {
  default: "text-gray-900",
  primary: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  custom: "",
} as const;

export const TextCell: FunctionComponent<TextCellProps> = ({
  children,
  variant = "normal",
  color = "default",
  className = "",
}: TextCellProps) => {
  const colorClass = colorClasses[color];
  const variantClass = variantClasses[variant];

  return (
    <div className={`${variantClass} ${colorClass} ${className}`}>
      {children}
    </div>
  );
};
