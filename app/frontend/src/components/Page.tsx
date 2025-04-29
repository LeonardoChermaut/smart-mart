import { ReactNode } from "react";

type PageProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  width?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "screen";
};

const widthClasses = {
  full: "max-w-full",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  screen: "w-screen",
} as const;

export const Page = ({
  title,
  children,
  className = "",
  width = "full",
}: PageProps) => {
  const widthClass = widthClasses[width as keyof typeof widthClasses] || width;

  return (
    <div className={`w-full ${className} ${widthClass} p-4 space-y-6`}>
      {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
      {children}
    </div>
  );
};
