import Link from "next/link";
import Button from "../atoms/Button";
import { SunOutlined } from "@ant-design/icons";
import BadgeCart from "../atoms/BadgeCart";

const menu = [
  {
    label: "Products",
    url: "/",
  },
  {
    label: "Cart",
    url: "/cart",
  },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-b-gray-300">
      <p className="text-lg font-semibold">NVP Store</p>
      <div className="flex gap-4">
        {menu.map((item, i) => (
          <Link href={item.url} key={i} className="flex items-center">
            <p className="text-sm">{item.label}</p>
            {item.label === "Cart" ? (
              <BadgeCart count={1} size="small" />
            ) : null}
          </Link>
        ))}
      </div>
      <Button icon={<SunOutlined />} size="large" />
    </nav>
  );
}
