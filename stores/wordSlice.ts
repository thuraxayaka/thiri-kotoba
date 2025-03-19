import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JapaneseWord, KoreanWord, ChineseWord, Language } from "@/types";

interface wordSlice {
  japanese: Partial<JapaneseWord>;

  korean: Partial<KoreanWord>;

  chinese: Partial<ChineseWord>;
  language: Language;
}

type langProps = {
  language: string | undefined;
  word: object;
  examples: Array<any>;
};

const initialState: wordSlice = {
  japanese: {},
  korean: {},
  chinese: {},
  language: "japanese",
};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    setLanguageData(state, action: PayloadAction<langProps>) {
      const { language, word, examples } = action.payload;

      switch (language) {
        case "japanese":
          state.japanese = { ...word, examples };
          break;
        case "korean":
          state.korean = { ...word, examples };
          break;
        case "chinese":
          state.chinese = { ...word, examples };
      }
    },
  },
});
export default wordSlice.reducer;
export const { setLanguageData } = wordSlice.actions;
