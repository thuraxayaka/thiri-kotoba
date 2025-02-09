import { configureStore } from "@reduxjs/toolkit";
import wordReducer from "@/stores/wordSlice";
import settingReducer from "@/stores/settingSlice";
const store = configureStore({
  reducer: {
    word: wordReducer,
    setting: settingReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
