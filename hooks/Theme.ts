import { useAppSelector } from "@/hooks/Hook";
type theme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  warningColor: string;
  dangerColor: string;
  successColor: string;
  faintedColor: string;
  mutedColor: string;
};
const darkTheme: theme = {
  primaryColor: "#2D283E",
  secondaryColor: "#47426B",
  accentColor: "#FF69B4",
  textColor: "#F9F5FF",
  warningColor: "#FFB800",
  dangerColor: "#D70040",
  successColor: "#2E8B57",
  faintedColor: "#FFC1D9",
  mutedColor: "#6B6785",
};
const lightTheme: theme = {
  primaryColor: "#F9F5FF",
  secondaryColor: "#E6E6FA",
  accentColor: "#FF69B4",
  textColor: "#2E2E2E",
  warningColor: "#FFD700",
  dangerColor: "#FF6347",
  successColor: "#98FF98",
  faintedColor: "#FFB6C1",
  mutedColor: "#737373",
};
export const useTheme = (): theme => {
  const theme = useAppSelector((state) => state.setting.theme);

  return theme === "dark" ? darkTheme : lightTheme;
};
