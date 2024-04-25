import dayjs from "dayjs";

const formatMoney = (price: number) => {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatDate = (date: string) => {
  const dateFormat = "ddd, MMMM DD, YYYY, h:mm A";
  return dayjs(date).format(dateFormat);
};

const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export { formatMoney, formatDate, generateRandomString };
