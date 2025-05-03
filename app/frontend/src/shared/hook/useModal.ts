import { useState } from "react";

type ModalType = "create" | "edit" | "upload" | "delete";

type ModalState<T> = {
  type: ModalType;
  data: T;
};

export const useModal = <T>() => {
  const [modalState, setModalState] = useState<ModalState<T>>({
    type: null,
    data: null,
  });

  const openModal = (type: Exclude<ModalType, null>, data?: T) =>
    setModalState({ type, data: data ?? null });

  const closeModal = () => setModalState({ type: null, data: null });

  const isCreating = modalState.type === "create";
  const isUploading = modalState.type === "upload";
  const isUpdating = modalState.type === "edit" && modalState.data !== null;

  return {
    modalState,
    openModal,
    closeModal,
    isCreating,
    isUpdating,
    isUploading,
  };
};
