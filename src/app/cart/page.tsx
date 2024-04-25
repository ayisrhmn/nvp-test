"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSelector, useDispatch } from "react-redux";
import { Input, Skeleton, Space } from "antd";
import { formatMoney } from "@/utils";
import { ProductsType } from "@/utils/types";
import { removeItem } from "@/redux/cartSlice";
import DataTable from "@/components/molecules/DataTable";
import InputQty from "@/components/atoms/InputQty";
import Button from "@/components/atoms/Button";
import { ShoppingCartOutlined } from "@ant-design/icons";

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
  columnHelper.accessor("quantity", {
    header: () => "Quantity",
    cell: (item) => {
      return <InputQty itemId={item.row.original.id} value={item.getValue()} />;
    },
  }),
];

export default function Cart() {
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state: any) => state.cart);
  const cartQty = cartItems.length;

  const [mode, setMode] = useState("table");

  const table = useReactTable({
    data: cartItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRemove = (id: any) => {
    dispatch(removeItem(id));
  };

  const cartTotal = cartItems
    .map((item: any) => item.price * item.quantity)
    .reduce((prevValue: any, currValue: any) => prevValue + currValue, 0);

  return (
    <>
      {mode === "table" ? (
        <div className="py-16 px-32">
          <p className="mb-6 text-2xl font-semibold">
            Cart List {cartQty > 0 ? `(${cartQty})` : ""}
          </p>
          <DataTable
            config={table}
            useLoading={false}
            hideSearch
            hideActionCart
            hideActionEdit
            noConfirmDelete
            onConfirmDelete={handleRemove}
            hidePagination
          />
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p className="text-lg">Total:</p>
              <p className="text-2xl font-semibold">{formatMoney(cartTotal)}</p>
            </div>
            <Button
              icon={<ShoppingCartOutlined />}
              type="primary"
              size="large"
              onClick={() => setMode("checkout")}
              disabled={cartQty === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-16 px-32 flex flex-col items-center">
          <p className="text-3xl font-semibold">Thank You !!!</p>
          <Image
            className="rounded-lg my-4"
            src={
              "https://img.freepik.com/premium-vector/online-mobile-payment-banking-service-concept-woman-pays-with-mobile-phone-successfully-safely-flat-vector-modern-illustration_566886-9730.jpg"
            }
            width={200}
            height={200}
            alt=""
          />
          <p className="text-lg font-medium mb-2">You have paid successfully</p>
          <p className="text-sm text-gray-500 text-center mb-6">
            You will never miss important product updates, latest news and
            <br />
            community QA sessions. Our newsletter is once a week, every Sunday.
          </p>
          <div className="w-[400px] mb-10">
            <Space.Compact style={{ width: "100%" }}>
              <Input placeholder="Input your email" size="large" />
              <Button type="primary" size="large">
                Subscribe
              </Button>
            </Space.Compact>
          </div>
          <Link href="/" className="mb-10">
            <Button type="primary" size="large" ghost>
              Return Home
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
