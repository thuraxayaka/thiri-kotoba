import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/hooks/Theme";
import JapaneseForm from "./JapaneseForm";
import KoreanForm from "./KoreanForm";
import ChineseForm from "./ChineseForm";
import RadioButton from "./RadioButton";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Language } from "@/types";
import {
  setShouldScrollToEnd,
  setShouldScrollToStart,
} from "@/stores/formSlice";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import { RootState } from "@/stores/store";

import AllForm from "./All";
type Props = {
  isVisible: boolean;
  animationType: "fade" | "slide" | "none";
  isTransparent: boolean;
  onClose: () => void;
};

type Option = {
  label: string;
  value: Language;
};
const AddWordModal = ({
  isVisible,
  animationType,
  isTransparent,
  onClose,
}: Props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const japaneseFormSelector = useAppSelector(
    (state: RootState) => state.form.japanese
  );
  const koreanFormSelector = useAppSelector(
    (state: RootState) => state.form.korean
  );
  // console.log(japaneseFormSelector, koreanFormSelector);
  const scrollRef = useRef<ScrollView>(null);
  const shouldScrollToEnd = useAppSelector(
    (state) => state.form.shouldScrollToEnd
  );
  const shouldScrollToStart = useAppSelector(
    (state: RootState) => state.form.shouldScrollToStart
  );
  const [fillAllInformation, setFillAllInformation] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Language>("japanese");

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    if (shouldScrollToStart) {
      dispatch(setShouldScrollToStart(false));
    }
  }, [selectedOption, fillAllInformation, shouldScrollToStart]);

  useEffect(() => {
    if (shouldScrollToEnd) {
      scrollRef.current?.scrollToEnd({ animated: true });
      dispatch(setShouldScrollToEnd(false));
    }
  }, [shouldScrollToEnd]);

  const options: Option[] = [
    { label: "Japanese", value: "japanese" },
    { label: "Chinese", value: "chinese" },
    { label: "Korean", value: "korean" },
  ];
  return (
    <SafeAreaView>
      <Modal
        visible={isVisible}
        transparent={isTransparent}
        animationType={animationType}
        onRequestClose={onClose}
      >
        <View>
          <View
            className="h-full justify-start items-center"
            style={{ backgroundColor: theme.faintedColor }}
          >
            <Image
              source={require("@/assets/images/cover_img.png")}
              style={{
                width: 240,
                height: 200,
                objectFit: "cover",
                position: "absolute",
                top: "-2%",
                right: "15%",
              }}
            />
          </View>
          <View
            className="absolute top-[20%] left-[0] shadow-black w-full  rounded-tl-3xl rounded-tr-3xl mx-auto gap-4 py-10 h-[85%] mb-12"
            style={{ backgroundColor: theme.primaryColor, flex: 1 }}
          >
            <View className="w-[80%] mx-auto pb-4 border-b-hairline">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-semibold">Add New Word</Text>
                <TouchableOpacity onPress={onClose}>
                  <Entypo name="cross" size={24} color="black" />
                </TouchableOpacity>
              </View>
              {!fillAllInformation && (
                <View>
                  <Text className="mb-4">Choose a langauge:</Text>
                  <RadioButton
                    selectedOption={selectedOption}
                    onSelect={setSelectedOption}
                    options={options}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  setFillAllInformation((prev) => !prev);
                }}
              >
                <View className="flex-row items-center gap-2 mb-2 mt-6">
                  <Fontisto
                    name={
                      fillAllInformation
                        ? "checkbox-active"
                        : "checkbox-passive"
                    }
                    size={16}
                    color="black"
                  />
                  <Text>Fill out all information at once</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <ScrollView className="flex-1 mb-8" ref={scrollRef}>
                {!fillAllInformation ? (
                  <View className="w-[80%] mx-auto ">
                    {selectedOption === "japanese" && <JapaneseForm />}
                    {selectedOption === "chinese" && <ChineseForm />}
                    {selectedOption === "korean" && <KoreanForm />}
                  </View>
                ) : (
                  <View className="w-[80%] mx-auto">
                    <AllForm />
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddWordModal;
