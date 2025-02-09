import { createSlice } from "@reduxjs/toolkit";

type settingState = {
  language: string;
  theme: string;
};
const initialState: settingState = {
  language: "en",
  theme: "light",
};
const settingSlice = createSlice({
  name: "settng",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
    },
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});
export default settingSlice.reducer;
export const { changeLanguage, changeTheme } = settingSlice.actions;
