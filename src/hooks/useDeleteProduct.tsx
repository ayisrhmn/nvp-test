import { http } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const deleteProduct = async (id: number) => {
  const res = await http.delete(`/products/${id}`);
  return res.data;
};

const useDeleteProduct = (keyword: string, offset: number, limit: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["products", keyword, offset, limit];

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Data deleted successfully", {
        position: "top-right",
        theme: "light",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.error("Error: Action execution failed", {
        position: "top-right",
        theme: "light",
      });
    },
  });
};

export { useDeleteProduct };
