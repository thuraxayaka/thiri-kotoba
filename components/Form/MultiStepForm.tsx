import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/hooks/Theme";
import JapaneseForm from "./JapaneseForm";
import KoreanForm from "./KoreanForm";
import ChineseForm from "./ChineseForm";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Language, stepMapper } from "@/types";
import {
  setShouldScrollToEnd,
  setShouldScrollToStart,
} from "@/stores/formSlice";
import Feather from "@expo/vector-icons/Feather";
import { RootState } from "@/stores/store";
import { reset } from "@/stores/formSlice";

type Props = {
  isVisible: boolean;
  animationType: "fade" | "slide" | "none";
  isTransparent: boolean;
  onClose: () => void;
};

const AddWordModal = ({
  isVisible,
  animationType,
  isTransparent,
  onClose,
}: Props) => {
  const INITIAL_STEP = 1;
  const INITIAL_LANGUAGE = "japanese";
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState<number>(INITIAL_STEP);
  const scrollRef = useRef<ScrollView>(null);
  const shouldScrollToEnd = useAppSelector(
    (state) => state.form.shouldScrollToEnd
  );
  const shouldScrollToStart = useAppSelector(
    (state: RootState) => state.form.shouldScrollToStart
  );
  const [selectedOption, setSelectedOption] =
    useState<Language>(INITIAL_LANGUAGE);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (isVisible && shouldScrollToStart) {
      dispatch(setShouldScrollToStart(false));
    }
  }, [shouldScrollToStart, isVisible, dispatch]);

  useEffect(() => {
    if (isVisible && shouldScrollToEnd) {
      scrollRef.current?.scrollToEnd({ animated: true });
      dispatch(setShouldScrollToEnd(false));
    }
  }, [shouldScrollToEnd, isVisible, dispatch]);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(INITIAL_STEP);
      setSelectedOption(INITIAL_LANGUAGE);
      dispatch(reset());
    }
  }, [isVisible]);

  const stepMap: stepMapper = {
    1: (
      <View>
        <View className="w-[80%] mx-auto pb-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold">Add New Word</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mx-auto w-4/5">
          <Text className="mb-4">Please choose a specific language:</Text>
          <View className="gap-4 w-full mx-auto">
            <TouchableOpacity
              onPress={() => {
                setSelectedOption("japanese");
                setCurrentStep(2);
              }}
            >
              <Text
                className=" w-full mx-auto rounded-lg py-2 text-lg text-center"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                Japanese
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedOption("chinese");
                setCurrentStep(2);
              }}
            >
              <Text
                className="w-full mx-auto rounded-lg py-2 text-lg text-center"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                Chinese
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedOption("korean");
                setCurrentStep(2);
              }}
            >
              <Text
                className="w-full mx-auto rounded-lg py-2 text-lg text-center"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                Korean
              </Text>
            </TouchableOpacity>

            {/* <Image
              source={require("@/assets/images/cherry2.webp")}
              style={{
                width: 450,
                height: 400,
                objectFit: "contain",
                position: "absolute",
                top: "130%",
                right: "-15%",
              }}
            /> */}
          </View>
        </View>
      </View>
    ),
    2: (
      <View className="flex-1">
        <ScrollView className="flex-1 mb-8" ref={scrollRef}>
          <View className="w-[80%] mx-auto ">
            {selectedOption === "japanese" && <JapaneseForm />}
            {selectedOption === "chinese" && <ChineseForm />}
            {selectedOption === "korean" && <KoreanForm />}
          </View>
        </ScrollView>
      </View>
    ),
  };
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
            className="h-full justify-start items-start"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {currentStep === 2 && (
              <TouchableOpacity
                className="ms-2 absolute left-0 z-10"
                onPress={() => {
                  setCurrentStep(1);
                }}
              >
                <Feather name="arrow-left" size={28} color="black" />
              </TouchableOpacity>
            )}
            <Image
              source={require("@/assets/images/japanese.webp")}
              style={{
                width: 420,
                height: 300,
                objectFit: "cover",
                position: "absolute",
                top: "-2%",
                left: "0%",
              }}
            />
          </View>
          <View
            className="absolute top-[20%] left-[0] shadow-black w-full border-[1px] border-t-2 border-red-300  rounded-tl-3xl rounded-tr-3xl mx-auto gap-4 py-10 h-[85%] mb-12"
            style={{ backgroundColor: theme.primaryColor, flex: 1 }}
          >
            {stepMap[currentStep]}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddWordModal;
