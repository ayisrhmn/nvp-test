"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { setNavActive } from "@/redux/navActive";
import Button from "../atoms/Button";
import BadgeCart from "../atoms/BadgeCart";
import { setThemeMode } from "@/redux/themeMode";

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
  const [mode, setMode] = useState<any>("light");

  const { cartItems } = useSelector((state: any) => state.cart);
  const { navActive } = useSelector((state: any) => state.nav);
  const { themeMode } = useSelector((state: any) => state.theme);

  const dispatch = useDispatch();

  const handleLink = (href: any) => {
    dispatch(setNavActive(href));
  };

  const handleTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    dispatch(setThemeMode(mode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const cartQty = cartItems.length;

  return (
    <main className={themeMode === "light" ? "main-light" : "main-dark"}>
      <nav className="flex items-center justify-between p-4 border-b border-b-gray-300">
        <p className="text-lg font-semibold">NVP Store</p>
        <div className="flex gap-4">
          {menu.map((item, i) => (
            <Link
              href={item.href}
              key={i}
              className="flex items-center"
              onClick={() => handleLink(item.href)}
            >
              <p
                className={
                  item.href === navActive
                    ? "text-sm font-medium text-blue-500"
                    : "text-sm"
                }
              >
                {item.label}
              </p>
              {item.label === "Cart" ? (
                <BadgeCart count={cartQty} size="small" />
              ) : null}
            </Link>
          ))}
        </div>
        <Button
          icon={themeMode === "light" ? <SunOutlined /> : <MoonOutlined />}
          size="large"
          onClick={handleTheme}
        />
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
    </main>
  );
}
