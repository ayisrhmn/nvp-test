import Button from "@/components/atoms/Button";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { ButtonProps } from "antd";

interface RowActionsProps {
  hideCart?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  onClickDelete?: ButtonProps["onClick"];
}

export default function RowActions({
  hideCart,
  hideEdit,
  hideDelete,
  onClickDelete,
}: RowActionsProps) {
  return (
    <div className="flex gap-2">
      {!hideCart ? (
        <Button icon={<ShoppingCartOutlined />} type="primary" />
      ) : null}
      {!hideEdit ? (
        <Button icon={<EditOutlined />} type="primary" ghost />
      ) : null}
      {!hideDelete ? (
        <Button
          icon={<DeleteOutlined />}
          type="primary"
          ghost
          danger
          onClick={onClickDelete}
        />
      ) : null}
    </div>
  );
}
