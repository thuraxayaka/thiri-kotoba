import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/stores/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
