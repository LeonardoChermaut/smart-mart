import { FunctionComponent, JSX } from "react";

type BaseButtonProps = {
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  icon?: JSX.Element;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  onClick: () => void;
};

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-yellow-600 text-white hover:bg-yellow-700",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;

export const BaseButton: FunctionComponent<BaseButtonProps> = ({
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  icon = null,
  className = "",
  title = "",
  variant = "secondary",
  size = "md",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 rounded-lg border shadow-sm
              focus:outline-none focus:ring-offset-2
              transition-all duration-150 ease-in-out
              transform active:scale-[0.98] active:brightness-95
              ${variants[variant]} ${sizes[size]}
              ${isLoading || disabled ? "opacity-70 cursor-not-allowed" : ""}
              ${className}`}
    >
      {icon && icon}
      {title}
    </button>
  );
};
