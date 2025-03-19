import { View, TextInput, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@/types";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { RootState, AppDispatch } from "@/stores/store";
import { setSearchWord } from "@/stores/searchSlice";
import { addNewWord } from "@/stores/wordSlice";
import { setIsModalVisible } from "@/stores/formSlice";
const SearchBox = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch<AppDispatch>();
  const searchSel = useAppSelector<RootState>(
    (state) => state.search.searchWord
  );
  const searchWord = searchSel as string;
  return (
    <View
      className="flex-row justify-between   items-center px-4"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <Pressable onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={24} color={theme.textColor} />
      </Pressable>
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
          onChangeText={(text) => dispatch(setSearchWord(text))}
          placeholder="Search..."
          cursorColor={theme.accentColor}
        />
      </View>
      <View className="flex-row gap-2 items-center justify-end">
        <TouchableOpacity
          className=" rounded-full justify-center items-center flex"
          onPress={() => dispatch(setIsModalVisible(true))}
        >
          <EvilIcons name="plus" size={30} color={theme.accentColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBox;
