import { ChineseWord, JapaneseWord, KoreanWord, Language, Map } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type field = {
  [key: string]: any;
};
type FormState = {
  shouldScrollToEnd: boolean;
  shouldScrollToStart: boolean;
  isModalVisible: boolean;
  japanese: Partial<JapaneseWord>;
  korean: Partial<KoreanWord>;
  chinese: Partial<ChineseWord>;
  language: Language;
  isSubmitted: boolean;
  requiredFields: field;
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
  requiredFields: {},
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
      // console.log("here : " + action.payload);
      state.isSubmitted = action.payload;
    },
    setRequiredFields(state, action: PayloadAction<any>) {
      // console.log("Required Fields in formSlice.js :");
      // console.log(action.payload);
      state.requiredFields = {
        ...state.requiredFields,
        ...action.payload,
      };

      // console.log(state.requiredFields);
    },
    removeRequiredFields(state, action: PayloadAction<any>) {
      const filteredKeys = Object.keys(state.requiredFields).filter(
        (value) => value !== action.payload
      );
      let updatedStates: Map<string> = {};
      filteredKeys.forEach((key) => {
        return (updatedStates[key] = state.requiredFields[key]);
      });

      state.requiredFields = updatedStates;
    },
    reset(state) {
      (state.chinese = {}),
        (state.korean = {}),
        (state.japanese = {}),
        (state.requiredFields = {}),
        (state.isSubmitted = false),
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
  setRequiredFields,
  removeRequiredFields,
} = formSlice.actions;
export default formSlice.reducer;
