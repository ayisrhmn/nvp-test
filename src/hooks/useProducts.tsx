import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async (offset = 0, limit: 5) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/products?offset=${offset}&limit=${limit}`
  );
  return data;
};

const useProducts = (offset: any, limit: any) => {
  return useQuery({
    queryKey: ["/products", `offset=${offset}`, `limit=${limit}`],
    queryFn: () => fetchProducts(offset, limit),
  });
};

export { useProducts };
