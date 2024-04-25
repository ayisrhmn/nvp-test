type ProductsType = {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
  };
  price: number;
  description: string;
  images: any;
  creationAt: string;
  updatedAt: string;
};

type FieldType = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: {
    id: string;
    url: string;
  }[];
};

export type { ProductsType, FieldType };
