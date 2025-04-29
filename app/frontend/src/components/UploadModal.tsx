import { FunctionComponent, useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      onClose();
      setFile(null);
    }
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
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
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
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                !file || isLoading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } transition-colors`}
            >
              {isLoading ? "Enviando..." : "Importar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
