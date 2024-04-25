import { http } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch } from "react";
import { toast } from "react-toastify";

const createProduct = async (data: any) => {
  const res = await http.post(`/products`, data);
  return res.data;
};

const useCreateProduct = (
  setMode: Dispatch<any>,
  keyword: string,
  offset: number,
  limit: number
) => {
  const queryClient = useQueryClient();
  const queryKey = ["products", keyword, offset, limit];

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      setMode("table");
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries();
      toast.success("Data created successfully", {
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

export { useCreateProduct };
