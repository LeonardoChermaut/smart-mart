import { ICategoryPayload } from "@/shared/interface/interface.ts";
import { queryKeys } from "@/shared/query/queryKey.ts";
import { categoryService } from "@/shared/service/categoryService.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: ICategoryPayload) =>
      categoryService.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast("Categoria criada com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao criar categoria", { type: "error" });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      category,
    }: {
      categoryId: number;
      category: ICategoryPayload;
    }) => categoryService.update(categoryId, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast("Categoria atualizada com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria", { type: "error" });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => categoryService.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast("Categoria excluída com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao excluir categoria", { type: "error" });
    },
  });
};

export const useUploadCategoriesCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => categoryService.uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast("CSV processado com sucesso", { type: "success" });
    },
    onError: () => {
      toast.error("Erro ao processar CSV", { type: "error" });
    },
  });
};
