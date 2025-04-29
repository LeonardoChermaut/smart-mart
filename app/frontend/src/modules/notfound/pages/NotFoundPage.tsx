import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center pb-6">
          <AlertTriangle
            className="text-emerald-500 dark:text-emerald-400"
            size={64}
          />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white pb-4">
          Página não encontrada
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-400 pb-6">
          A página que você está tentando acessar não existe ou foi movida.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};
