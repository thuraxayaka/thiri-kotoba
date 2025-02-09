import { createSlice } from "@reduxjs/toolkit";
type word = {
  id: number;
  word: string;
  type: string;
  japanese: {
    meaning: string;
    hiragana: string;
    romaji: string;
    level: number;
  };
  chinese: {
    meaning: string;
    pinyin: string;
  };
  burmese: {
    meaning: string;
  };
  korean: {
    meaning: string;
    reading: string;
  };
};
interface wordSlice {
  words: word[];
}

const initialState: wordSlice = {
  words: [],
};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    setWords: (state, action) => {
      state.words = action.payload;
    },
  },
});
export default wordSlice.reducer;
export const { setWords } = wordSlice.actions;
