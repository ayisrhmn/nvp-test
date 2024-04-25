import { useQuery } from "@tanstack/react-query";
import { generateRandomString, http } from "@/utils";

const fetchProduct = async (id: number | null) => {
  if (id === null) return true;
  const res = await http.get(`/products/${id}`);
  const mappedImages = res.data.images.map((item: string) => ({
    id: generateRandomString(10),
    url: item,
  }));
  return { ...res.data, images: mappedImages };
};

const useProduct = (id: number | null) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });
};

export { useProduct };
