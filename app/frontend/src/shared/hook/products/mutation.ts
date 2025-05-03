import {
  IProduct,
  IProductCreatePayload,
} from "@/shared/interface/interface.ts";
import { queryKeys } from "@/shared/query/queryKey.ts";
import { productService } from "@/shared/service/productService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: IProductCreatePayload) =>
      productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast("Produto criado com sucesso", { type: "success" });
    },
    onError: () => toast.error("Erro ao criar produto", { type: "error" }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: IProduct) => productService.update(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast("Produto atualizado com sucesso", { type: "success" });
    },
    onError: () => toast.error("Erro ao atualizar produto", { type: "error" }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => productService.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast("Produto excluído com sucesso", { type: "success" });
    },
    onError: () => toast.error("Erro ao excluir produto", { type: "error" }),
  });
};

export const useUploadProductsCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => productService.uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast("CSV processado com sucesso", { type: "success" });
    },
    onError: () => toast.error("Erro ao processar CSV", { type: "error" }),
  });
};

export const useExportProducts = () => {
  return useMutation({
    mutationFn: () => productService.exportCSV(),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products_export.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast("Exportação concluída", { type: "success" });
    },
    onError: () => toast.error("Erro ao exportar produtos", { type: "error" }),
  });
};
