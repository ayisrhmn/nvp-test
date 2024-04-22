"use client";

import { useProducts } from "@/hooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton, Avatar } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Alert from "@/components/atoms/Alert";
import Button from "@/components/atoms/Button";
import { formatDate, formatMoney } from "@/utils";
import Image from "next/image";

type ProductsType = {
  id: number;
  title: string;
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
      return (
        <Avatar
          shape="square"
          size={100}
          src={
            <Image src={images.getValue()[0]} height={100} width={100} alt="" />
          }
        />
      );
    },
  }),
  columnHelper.accessor("title", {
    header: () => "Title",
    cell: (title) => title.getValue(),
  }),
  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (price) => `${formatMoney(price.getValue())}`,
  }),
  columnHelper.accessor("creationAt", {
    header: () => "Creation At",
    cell: (creationAt) => `${formatDate(creationAt.getValue())}`,
  }),
  columnHelper.accessor("updatedAt", {
    header: () => "Updated At",
    cell: (updatedAt) => `${formatDate(updatedAt.getValue())}`,
  }),
  columnHelper.accessor("id", {
    header: () => "Actions",
    cell: (id) => {
      return (
        <div className="flex gap-2">
          <Button icon={<ShoppingCartOutlined />} type="primary" />
          <Button icon={<EditOutlined />} type="primary" ghost />
          <Button icon={<DeleteOutlined />} type="primary" ghost danger />
        </div>
      );
    },
  }),
];

export default function Products() {
  const { status, data, error } = useProducts(0, 5);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="py-16 px-32">
      <p className="mb-6 text-2xl font-semibold">Product List</p>
      {status === "pending" ? (
        <Skeleton active />
      ) : status === "error" ? (
        <Alert
          message="Error"
          description={error?.message}
          type="error"
          showIcon
        />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
