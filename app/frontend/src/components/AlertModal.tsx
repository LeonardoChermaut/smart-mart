import { FunctionComponent, ReactNode } from "react";
import { BaseButton } from "./BaseButton.tsx";
import { Modal } from "./Modal.tsx";

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  onConfirm: () => void;
  onCancel: () => void;
};

const variantClasses = {
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  primary: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
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
              : variant === "primary"
              ? "info"
              : "check_circle"}
          </span>
          <div className="text-sm">{message}</div>
        </div>

        <div className="flex justify-end space-x-3 pt-2 pb-2">
          <BaseButton
            title={cancelText}
            onClick={onCancel}
            variant="secondary"
          />
          <BaseButton
            title={confirmText}
            onClick={onConfirm}
            variant={variant}
          />
        </div>
      </div>
    </Modal>
  );
};
