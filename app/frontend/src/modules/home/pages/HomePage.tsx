import { Page } from "@/components/Page.tsx";

export const HomePage = () => {
  return (
    <Page title="Visão Geral do SmartMart">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Vendas por Mês</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Lucro por Mês</h2>
        </div>
      </div>
    </Page>
  );
};
