import { FunctionComponent, ReactNode } from "react";
import { Modal } from "./Modal.tsx";

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  size?: "sm" | "md" | "lg";
  onConfirm: () => void;
  onCancel: () => void;
};

const variantClasses = {
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
} as const;

const buttonClasses = {
  danger: "bg-red-600 hover:bg-red-700",
  warning: "bg-yellow-600 hover:bg-yellow-700",
  info: "bg-blue-600 hover:bg-blue-700",
  success: "bg-green-600 hover:bg-green-700",
} as const;

export const AlertModal: FunctionComponent<AlertModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  size = "md",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size={size}>
      <div className="space-y-4">
        <div
          className={`flex items-start p-4 rounded-lg ${variantClasses[variant]}`}
        >
          <span className="material-icons text-2xl mr-3">
            {variant === "danger"
              ? "error"
              : variant === "warning"
              ? "warning"
              : variant === "info"
              ? "info"
              : "check_circle"}
          </span>
          <div className="text-sm">{message}</div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${buttonClasses[variant]} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
