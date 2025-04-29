import { FunctionComponent, ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  onClose: () => void;
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-opacity-10 backdrop-blur-xs transition-opacity duration-300 z-50 p-4 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full p-6 transition-transform transform ease-in-out ${
          sizeClasses[size]
        } ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Fechar modal"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};
