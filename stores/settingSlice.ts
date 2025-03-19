import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type settingState = {
  language: string;
  theme: string;
  tabBarHeight: number;
};

const initialState: settingState = {
  language: "en",
  theme: "light",
  tabBarHeight: 0,
};
const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    changeTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setTabbarHeight: (state, action: PayloadAction<number>) => {
      state.tabBarHeight = action.payload;
    },
  },
});
export default settingSlice.reducer;
export const { changeLanguage, changeTheme, setTabbarHeight } =
  settingSlice.actions;
