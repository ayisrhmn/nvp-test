import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state: any, action: any) {
      const newItemId = action.payload.id;
      const existingItem = state.cartItems.find(
        (item: any) => item.id === newItemId
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeItem(state: any, action: any) {
      state.cartItems = state.cartItems.filter(
        (item: any) => item.id !== action.payload
      );
    },
    incrementItem(state: any, action: any) {
      state.cartItems = state.cartItems.map((item: any) => {
        if (item.id === action.payload) {
          item.quantity++;
        }
        return item;
      });
    },
    decrementItem(state: any, action: any) {
      state.cartItems = state.cartItems
        .map((item: any) => {
          if (item.id === action.payload) {
            item.quantity--;
          }
          return item;
        })
        .filter((item: any) => item.quantity !== 0);
    },
  },
});

export const { addItem, removeItem, incrementItem, decrementItem } =
  cartSlice.actions;
export default cartSlice.reducer;