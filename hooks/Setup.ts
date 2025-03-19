import { useDownloadData } from "./DownloadData";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";

import React from "react";
export const useInitialized = () => {
  React.useEffect(() => {}, []);
};
