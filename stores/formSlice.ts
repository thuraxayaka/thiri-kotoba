import { ChineseWord, JapaneseWord, KoreanWord, Language } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormState = {
  shouldScrollToEnd: boolean;
  shouldScrollToStart: boolean;
  isModalVisible: boolean;
  japanese: Partial<JapaneseWord>;
  korean: Partial<KoreanWord>;
  chinese: Partial<ChineseWord>;
  language: Language;
  isSubmitted: boolean;
};
const initialState: FormState = {
  shouldScrollToEnd: false,
  shouldScrollToStart: false,
  isModalVisible: false, //to track add new word modal
  japanese: {},
  korean: {},
  chinese: {},
  isSubmitted: false,
  language: "japanese",
};

const formSlice = createSlice({
  initialState,
  name: "form",
  reducers: {
    setShouldScrollToEnd(state, action: PayloadAction<boolean>) {
      state.shouldScrollToEnd = action.payload;
    },
    setShouldScrollToStart(state, action: PayloadAction<boolean>) {
      state.shouldScrollToStart = action.payload;
    },
    setIsModalVisible(state, action: PayloadAction<boolean>) {
      state.isModalVisible = action.payload;
    },
    updateJapaneseWord(state, action: PayloadAction<Partial<JapaneseWord>>) {
      state.language = "japanese";
      state.japanese = {
        ...state.japanese,
        ...action.payload,
      };
    },
    updateChineseWord(state, action: PayloadAction<Partial<ChineseWord>>) {
      state.language = "chinese";
      state.chinese = {
        ...state.chinese,
        ...action.payload,
      };
    },
    updateKoreanWord(state, action: PayloadAction<Partial<KoreanWord>>) {
      state.language = "korean";
      state.korean = {
        ...state.korean,
        ...action.payload,
      };
    },
    updateAll(state, action: PayloadAction<any>) {},
    setSubmitted(state, action: PayloadAction<boolean>) {
      state.isSubmitted = action.payload;
    },
    reset(state) {
      (state.chinese = {}),
        (state.korean = {}),
        (state.japanese = {}),
        (state.language = "japanese");
    },
  },
});

export const {
  setShouldScrollToEnd,
  setShouldScrollToStart,
  setIsModalVisible,
  updateJapaneseWord,
  updateChineseWord,
  updateKoreanWord,
  reset,
  updateAll,
  setSubmitted,
} = formSlice.actions;
export default formSlice.reducer;
