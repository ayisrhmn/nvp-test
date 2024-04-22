import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface BadgeCartProps {
  count: React.ReactNode;
  size?: "small" | "default" | undefined;
}

export default function BadgeCart(props: BadgeCartProps) {
  return (
    <Badge {...props}>
      <ShoppingCartOutlined className="text-blue-500 text-base ml-1" />
    </Badge>
  );
}
