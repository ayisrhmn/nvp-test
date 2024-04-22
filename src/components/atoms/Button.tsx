import { Button } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";

interface ButtonProps {
  type?: "primary" | "default" | "dashed" | "text" | "link";
  size?: SizeType;
  icon?: React.ReactNode;
  danger?: boolean;
  ghost?: boolean;
  children?: React.ReactNode;
}

export default function AntButton({ children, ...props }: ButtonProps) {
  return <Button {...props}>{children}</Button>;
}
