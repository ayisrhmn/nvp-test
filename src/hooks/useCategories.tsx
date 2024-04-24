import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { http } from "@/utils";

const fetchCategories = async () => {
  const res = await http.get(`/categories`);
  const mappedData = res.data.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  return mappedData;
};

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    placeholderData: keepPreviousData,
  });
};

export { useCategories };
