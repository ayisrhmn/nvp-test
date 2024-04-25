import { useDispatch } from "react-redux";
import { Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { decrementItem, incrementItem } from "@/redux/cartSlice";
import Button from "./Button";

interface InputQtyProps {
  itemId: number;
  value: string | number;
}

export default function InputQty({ itemId, value }: InputQtyProps) {
  const dispatch = useDispatch();

  const handleIncrement = (id: any) => {
    dispatch(incrementItem(id));
  };

  const handleDecrement = (id: any) => {
    dispatch(decrementItem(id));
  };

  return (
    <div className="flex gap-2 items-center">
      <div>
        <Button
          icon={<MinusOutlined />}
          type="primary"
          danger
          size="small"
          onClick={() => handleDecrement(itemId)}
        />
      </div>
      <Input className="w-[80px] text-center" value={value} size="middle" readOnly />
      <div>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="small"
          onClick={() => handleIncrement(itemId)}
        />
      </div>
    </div>
  );
}
