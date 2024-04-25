"use client";

import Link from "next/link";
import { SunOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Button from "../atoms/Button";
import BadgeCart from "../atoms/BadgeCart";

interface LayoutProps {
  children: React.ReactNode;
}

const menu = [
  {
    label: "Products",
    href: "/",
  },
  {
    label: "Cart",
    href: "/cart",
  },
];

export default function Layout({ children }: LayoutProps) {
  const { cartItems } = useSelector((state: any) => state.cart);
  const cartQty = cartItems.length;

  return (
    <>
      <nav className="flex items-center justify-between p-4 border-b border-b-gray-300">
        <p className="text-lg font-semibold">NVP Store</p>
        <div className="flex gap-4">
          {menu.map((item, i) => (
            <Link href={item.href} key={i} className="flex items-center">
              <p className="text-sm">{item.label}</p>
              {item.label === "Cart" ? (
                <BadgeCart count={cartQty} size="small" />
              ) : null}
            </Link>
          ))}
        </div>
        <Button icon={<SunOutlined />} size="large" />
      </nav>
      {children}
      <footer className="flex items-center justify-center p-4 border-t border-b-gray-300">
        <p className="text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://ayisdev.my.id"
            target="_blank"
            className="underline font-semibold"
          >
            ayisdev
          </a>
          . All rights reserved
        </p>
      </footer>
    </>
  );
}
