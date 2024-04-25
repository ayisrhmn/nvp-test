import { http } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch } from "react";
import { toast } from "react-toastify";

const editProduct = async (data: { id: number; item: any }) => {
  const res = await http.put(`/products/${data.id}`, data.item);
  return res.data;
};

const useEditProduct = (
  setMode: Dispatch<any>,
  keyword: string,
  offset: number,
  limit: number
) => {
  const queryClient = useQueryClient();
  const queryKey = ["products", keyword, offset, limit];

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      setMode("table");
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries();
      toast.success("Data updated successfully", {
        position: "top-right",
        theme: "light",
      });
    },
    onError: () => {
      setMode("table");
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries();
      toast.error("Error: Action execution failed", {
        position: "top-right",
        theme: "light",
      });
    },
  });
};

export { useEditProduct };
