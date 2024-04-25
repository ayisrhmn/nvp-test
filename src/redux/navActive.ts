import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  navActive: "/",
};

const navActive = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setNavActive(state: any, action: any) {
      state.navActive = action.payload;
    },
  },
});

export const { setNavActive } = navActive.actions;
export default navActive.reducer;
