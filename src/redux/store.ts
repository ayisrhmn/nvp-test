import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import navActive from "./navActive";
import themeMode from "./themeMode";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    nav: navActive,
    theme: themeMode,
  },
});

export default store;
