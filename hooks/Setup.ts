import { useDownloadData } from "./DownloadData";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { setWords } from "@/stores/wordSlice";
import React from "react";
export const useInitialized = () => {
  React.useEffect(() => {}, []);
};
