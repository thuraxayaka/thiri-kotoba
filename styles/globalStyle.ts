import { useAppSelector } from "@/hooks/Hook";
type theme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
};
const darkTheme: theme = {
  primaryColor: "#2D283E",
  secondaryColor: "#47426B",
  accentColor: "#FF69B4",
  textColor: "#F9F5FF",
};
const lightTheme: theme = {
  primaryColor: "#F9F5FF",
  secondaryColor: "#E6E6FA",
  accentColor: "#FF69B4",
  textColor: "#2E2E2E",
};
export default function theme(): theme {
  const theme = useAppSelector((state) => state.setting.theme);
  console.log(theme);
  return theme === "dark" ? darkTheme : lightTheme;
}
