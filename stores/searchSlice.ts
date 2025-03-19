import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
type searchState = {
  searchWord: string;
};
const initialState: searchState = {
  searchWord: "",
};
const searchReducer = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchWord: (state, action: PayloadAction<string>) => {
      state.searchWord = action.payload;
    },
  },
});

export default searchReducer.reducer;
export const { setSearchWord } = searchReducer.actions;
