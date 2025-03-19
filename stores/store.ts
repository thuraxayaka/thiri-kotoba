import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "@/stores/wordSlice";
import settingReducer from "@/stores/settingSlice";
import searchReducer from "@/stores/searchSlice";
import formReducer from '@/stores/formSlice';
const store = configureStore({
  reducer: {
    word: wordReducer,
    setting: settingReducer,
    search: searchReducer,
    form: formReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
