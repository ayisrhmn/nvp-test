"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
  useProducts,
} from "@/hooks";
import { ZodType, z } from "zod";
import { Skeleton } from "antd";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cartSlice";
import { toast } from "react-toastify";
import DataTable from "@/components/molecules/DataTable";
import FormProduct from "@/components/molecules/FormProduct";
import { formatDate, formatMoney } from "@/utils";
import { FieldType, ProductsType } from "@/utils/types";

const columnHelper = createColumnHelper<ProductsType>();
const columns = [
  columnHelper.accessor("images", {
    header: () => "Images",
    cell: (images) => {
      const arrImg = images.getValue().map((item: any) => {
        return item.replace(/[\[\]"]/g, "");
      });
      const urlImage = arrImg[0].startsWith("http") ? arrImg[0] : null;
      return (
        <>
          {urlImage ? (
            <Image
              className="rounded-md"
              src={arrImg[0]}
              height={100}
              width={100}
              alt=""
            />
          ) : (
            <Skeleton.Image />
          )}
        </>
      );
    },
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (item) => item.getValue(),
  }),
  columnHelper.accessor("category", {
    header: () => "Category",
    cell: (item) => item.getValue().name,
  }),
  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (item) => `${formatMoney(item.getValue())}`,
  }),
  columnHelper.accessor("creationAt", {
    header: () => "Creation At",
    cell: (item) => `${formatDate(item.getValue())}`,
  }),
  columnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (item) => `${formatDate(item.getValue())}`,
  }),
];

const schema: ZodType<FieldType> = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  price: z.number({
    required_error: "Price is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  categoryId: z.number({
    required_error: "Category is required",
  }),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string({
        required_error: "Url images is required",
      }),
    })
  ),
});

export default function Products() {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState("table");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [idProduct, setIdProduct] = useState<number | null>(null);

  const products = useProducts(keyword, offset, limit);
  const createProduct = useCreateProduct(setMode, keyword, offset, limit);
  const editProduct = useEditProduct(setMode, keyword, offset, limit);
  const deleteProduct = useDeleteProduct(keyword, offset, limit);

  const dispatch = useDispatch();

  const table = useReactTable({
    data: products.data?.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (value: string) => setKeyword(value);

  const handleClickAdd = () => {
    setMode("form");
  };

  const handleAddToCart = (item: any) => {
    dispatch(addItem({ ...item, quantity: 1 }));
    toast.success(`${item.title} successfully added to your cart!`, {
      position: "top-right",
      theme: "light",
    });
  };

  const handleClickEdit = (id: number) => {
    setMode("form");
    setIdProduct(id);
  };

  const handleConfirmDelete = (id: number) => {
    deleteProduct.mutateAsync(id).then(() => {
      if (products.data?.items.length <= 1) {
        setOffset(offset - limit);
        setPage(page - 1);
      }
    });
  };

  const handleClickBack = () => {
    setMode("table");
    setIdProduct(null);
    queryClient.invalidateQueries({
      queryKey: ["products", keyword, offset, limit],
    });
    queryClient.removeQueries();
  };

  const handleSubmitForm = (data: any) => {
    const mappedImages = data.images.map((item: any) => item.url);
    const newData = {
      ...data,
      images: mappedImages,
    };
    if (!idProduct) {
      createProduct.mutate(newData);
    } else {
      editProduct.mutateAsync({ id: idProduct, item: newData }).then(() => {
        setIdProduct(null);
      });
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    const pageOffset = (page - 1) * limit;
    setOffset(pageOffset);
    setLimit(pageSize);
    setPage(page);
  };

  return (
    <>
      {mode === "table" ? (
        <div className="py-16 px-32">
          <p className="mb-6 text-2xl font-semibold">Product List</p>
          <DataTable
            config={table}
            onSearch={handleSearch}
            queryResults={products}
            onClickAdd={handleClickAdd}
            onClickCart={handleAddToCart}
            onClickEdit={handleClickEdit}
            onConfirmDelete={handleConfirmDelete}
            page={page}
            pageSize={limit}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <FormProduct
          itemId={idProduct}
          schema={schema}
          onClickBack={handleClickBack}
          onSubmitForm={handleSubmitForm}
        />
      )}
    </>
  );
}
