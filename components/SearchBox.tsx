import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { useTheme } from "@/hooks/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
type Props = {
  searchWord: string | undefined;
  setSearchWord: (searchWord: string) => void;
  sync: () => void;
  showHistory: () => void;
};
const SearchBox = ({ searchWord, setSearchWord, sync, showHistory }: Props) => {
  const theme = useTheme();

  return (
    <View className="flex-row justify-between   items-center px-4">
      <View className="flex-row items-center w-[80%]  relative">
        <Ionicons
          name="search-outline"
          size={24}
          color={theme.textColor}
          className="absolute left-2  z-10"
        />
        <TextInput
          className="border w-[100%]  ps-10 rounded-2xl"
          style={{
            borderColor: theme.secondaryColor,
            backgroundColor: theme.secondaryColor,
          }}
          value={searchWord}
          onChangeText={setSearchWord}
          placeholder="Search..."
          cursorColor={theme.accentColor}
        />
      </View>
      <View className="flex-row gap-2 items-center justify-end">
        <TouchableHighlight
          underlayColor={theme.secondaryColor}
          className=" rounded-full justify-center items-center flex"
          onPress={showHistory}
        >
          <MaterialIcons name="history" size={26} color={theme.textColor} />
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={theme.secondaryColor}
          onPress={sync}
          className=" rounded-full justify-center items-center flex"
        >
          <Ionicons name="sync" size={26} color={theme.textColor} />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default SearchBox;
