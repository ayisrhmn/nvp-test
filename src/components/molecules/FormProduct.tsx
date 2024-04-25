import { useEffect } from "react";
import { useProduct, useCategories } from "@/hooks";
import { Alert, Input, InputNumber, Select, Skeleton } from "antd";
import { generateRandomString } from "@/utils";
import Button from "@/components/atoms/Button";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { FieldType } from "@/utils/types";
import Image from "next/image";

interface FormProductProps {
  itemId: number | null;
  schema: ZodType<FieldType>;
  onClickBack?: () => void;
  onSubmitForm?: (data: any) => void;
}

export default function FormProduct({
  itemId,
  schema,
  onClickBack,
  onSubmitForm,
}: FormProductProps) {
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
                  {itemId ? (
                    <Image
                      className="rounded-md mr-4"
                      src={item.url}
                      height={120}
                      width={120}
                      alt=""
                    />
                  ) : null}
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
