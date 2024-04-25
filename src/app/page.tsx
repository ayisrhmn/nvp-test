"use client";

import { useEffect, useState } from "react";
import {
  useCategories,
  useCreateProduct,
  useDeleteProduct,
  useEditProduct,
  useProduct,
  useProducts,
} from "@/hooks";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Alert, Input, InputNumber, Select, Skeleton } from "antd";
import { formatDate, formatMoney, generateRandomString } from "@/utils";
import Image from "next/image";
import DataTable from "@/components/molecules/DataTable";
import Button from "@/components/atoms/Button";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const table = useReactTable({
    data: products.data?.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (value: string) => setKeyword(value);

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
            onClickAdd={() => {
              setMode("form");
            }}
            onClickEdit={(id: number) => {
              setMode("form");
              setIdProduct(id);
            }}
            onConfirmDelete={(id: number) => {
              deleteProduct.mutateAsync(id).then(() => {
                if (products.data?.items.length <= 1) {
                  setOffset(offset - limit);
                  setPage(page - 1);
                }
              });
            }}
            page={page}
            pageSize={limit}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <FormProduct
          itemId={idProduct}
          onClickBack={() => {
            setMode("table");
            setIdProduct(null);
            queryClient.invalidateQueries({
              queryKey: ["products", keyword, offset, limit],
            });
            queryClient.removeQueries();
          }}
          onSubmitForm={(data: any) => {
            const mappedImages = data.images.map((item: any) => item.url);
            const newData = {
              ...data,
              images: mappedImages,
            };
            if (!idProduct) {
              createProduct.mutate(newData);
            } else {
              editProduct.mutate({ id: idProduct, item: newData });
            }
          }}
        />
      )}
    </>
  );
}

interface FormProductProps {
  itemId: number | null;
  onClickBack?: () => void;
  onSubmitForm?: (data: any) => void;
}

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

function FormProduct({ itemId, onClickBack, onSubmitForm }: FormProductProps) {
  const categories = useCategories();
  const product = useProduct(itemId);

  useEffect(() => {
    if (product.status === "success" && product.data?.images) {
      remove(0);
      product.data?.images.map((item: any) => {
        append({ ...item, url: item?.url?.replace(/[\[\]"]/g, "") });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.status, product.data]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldType>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [{ id: generateRandomString(10), url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const onSubmit = (data: any) => onSubmitForm?.(data);

  return (
    <div className="py-16 px-32">
      <div className="mb-10 flex items-center justify-between">
        <p className="text-2xl font-semibold">Add Product</p>
        <Button icon={<ArrowLeftOutlined />} size="large" onClick={onClickBack}>
          Back
        </Button>
      </div>

      {product.status === "pending" ? (
        <Skeleton active />
      ) : product.status === "error" ? (
        <Alert
          message="Error"
          description={product.error?.message}
          type="error"
          showIcon
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex gap-4 mb-4">
              <Controller
                control={control}
                name="title"
                defaultValue={product.data ? product.data.title : ""}
                render={({ field }) => (
                  <div className="w-full">
                    <p className="text-xs font-normal mb-1">
                      <b className="text-red-500">*</b>Title
                    </p>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Input title"
                      size="large"
                      status={errors.title && "error"}
                    />
                    {errors.title && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.title.message}
                      </span>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="price"
                defaultValue={product.data ? product.data.price : undefined}
                render={({ field }) => (
                  <div className="flex flex-col w-full">
                    <p className="text-xs font-normal mb-1">
                      <b className="text-red-500">*</b>Price
                    </p>
                    <InputNumber<number>
                      {...field}
                      value={field.value}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                      }
                      status={errors.price && "error"}
                      size="large"
                      className="w-full mb-2"
                    />
                    {errors.price && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.price.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex gap-4 mb-4">
              <Controller
                control={control}
                name="description"
                defaultValue={product.data ? product.data.description : ""}
                render={({ field }) => (
                  <div className="w-full">
                    <p className="text-xs font-normal mb-1">
                      <b className="text-red-500">*</b>Description
                    </p>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Input description"
                      size="large"
                      status={errors.description && "error"}
                    />
                    {errors.description && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="categoryId"
                defaultValue={product.data ? product.data.category?.id : ""}
                render={({ field }) => (
                  <div className="flex flex-col w-full">
                    <p className="text-xs font-normal mb-1">
                      <b className="text-red-500">*</b>Category
                    </p>
                    <Select
                      {...field}
                      value={field.value}
                      placeholder="Select category"
                      size="large"
                      options={
                        categories.status === "success" ? categories.data : []
                      }
                      status={errors.categoryId && "error"}
                      className="w-full mb-2"
                    />
                    {errors.categoryId && (
                      <span className="text-xs font-medium text-red-500">
                        {errors.categoryId.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="mb-4 flex gap-4 items-center justify-center"
                >
                  <input {...register(`images.${index}.id`)} hidden />
                  <Controller
                    control={control}
                    name={`images.${index}.url`}
                    render={({ field }) => (
                      <div className="w-full">
                        <p className="text-xs font-normal mb-1">
                          Url images - {index + 1}
                        </p>
                        <Input
                          {...field}
                          placeholder="Input url images"
                          size="large"
                          status={errors.images?.[index]?.url && "error"}
                        />
                        {errors.images?.[index]?.url && (
                          <span className="text-xs font-medium text-red-500">
                            {errors.images?.[index]?.url?.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  {fields.length > 1 ? (
                    <div className="pt-4">
                      <Button
                        icon={<DeleteOutlined />}
                        type="primary"
                        danger
                        onClick={() => remove(index)}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() =>
                  append({ id: generateRandomString(10), url: "" })
                }
              >
                Add url images
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              size="large"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
