import { isCSVFile } from "@/shared/utils/utils.ts";
import { FormEvent, FunctionComponent, useState } from "react";
import { toast } from "react-toastify";
import { BaseButton } from "./BaseButton.tsx";

type UploadCSVModalProps = {
  isOpen: boolean;
  title?: string;
  isLoading?: boolean;
  description?: string;
  onClose: () => void;
  onUpload: (file: File) => void;
};

export const UploadCSVModal: FunctionComponent<UploadCSVModalProps> = ({
  isOpen,
  isLoading = false,
  title = "Importar CSV",
  description = "CSV com os dados",
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (file && !isCSVFile(file)) {
      toast.error("Formato de arquivo inválido. Selecione um arquivo CSV.");
      setFile(null);
      return;
    }

    onUpload(file);
    onClose();
    return setFile(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transition-transform transform ease-in-out scale-95 hover:scale-100">
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

        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <label className="block text-sm font-medium text-gray-700 pb-2">
              Arquivo CSV
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-600 transition-colors">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span className="text-sm">Selecione um arquivo</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={(e) => setFile(e.target.files?.[0])}
                    />
                  </label>
                  <p className="text-sm text-gray-500 pl-2">
                    ou arraste e solte
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {file ? file.name : description}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <BaseButton
              onClick={onClose}
              variant="secondary"
              size="md"
              title="Cancelar"
            />

            <BaseButton
              type="submit"
              disabled={!file || isLoading}
              isLoading={isLoading}
              variant="primary"
              onClick={() => handleSubmit}
              size="md"
              title={isLoading ? "Exportando..." : "Exportar"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
