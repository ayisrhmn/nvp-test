import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { http } from "@/utils";

const fetchProducts = async (
  keyword: string,
  offset: number,
  limit: number
) => {
  const res = await http.get(
    `/products?${
      keyword.length > 0 ? `title=${keyword}&` : ""
    }offset=${offset}&limit=${limit}`
  );
  const r = await http.get(
    `/products?${keyword.length > 0 ? `title=${keyword}` : ""}`
  );
  return { items: res.data, count: r.data.length };
};

const useProducts = (keyword: string, offset: number, limit: number) => {
  return useQuery({
    queryKey: ["products", keyword, offset, limit],
    queryFn: () => fetchProducts(keyword, offset, limit),
    placeholderData: keepPreviousData,
  });
};

export { useProducts };
