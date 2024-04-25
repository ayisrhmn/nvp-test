import { Alert } from "antd";

interface AlertProps {
  message: string;
  description: string  | undefined;
  type?: "success" | "info" | "warning" | "error" | undefined;
  showIcon?: boolean;
}

export default function AntAlert(props: AlertProps) {
  return <Alert {...props} />;
}
