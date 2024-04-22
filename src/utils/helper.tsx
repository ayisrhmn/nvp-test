import dayjs from "dayjs";

const formatMoney = (price: number) => {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatDate = (date: string) => {
  const dateFormat = "ddd, MMMM DD, YYYY, h:mm A";
  return dayjs(date).format(dateFormat);
};

export { formatMoney, formatDate };
