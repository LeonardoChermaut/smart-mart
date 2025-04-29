import { ISale, ISaleAnalyticsParams } from "@/shared/interface/interface.ts";
import { queryKeys } from "@/shared/query/queryKey.ts";
import { salesService } from "@/shared/service/saleService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sale: Omit<ISale, "id">) => salesService.create(sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      toast("Venda criada com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao criar venda", { type: "error" });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sale: Partial<ISale>) => salesService.update(sale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      toast("Venda atualizada com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao atualizar venda", { type: "error" });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleId: number) => salesService.delete(saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      toast("Venda excluída com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao excluir venda", { type: "error" });
    },
  });
};

export const useUploadSalesCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => salesService.uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      toast("CSV processado com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao processar CSV", { type: "error" });
    },
  });
};

export const useExportSalesAnalytics = () => {
  return useMutation({
    mutationFn: ({ year, skip, limit }: ISaleAnalyticsParams) =>
      salesService.exportAnalyticsExcel({ year, skip, limit }),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sales_analytics_export.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast("Exportação concluída", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao exportar vendas", { type: "error" });
    },
  });
};
