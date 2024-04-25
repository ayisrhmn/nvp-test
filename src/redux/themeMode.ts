import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: "light",
};

const themeMode = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode(state: any, action: any) {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeMode.actions;
export default themeMode.reducer;
