import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState, useEffect, useMemo } from "react";
import SelectBox from "./SelectBox";
import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import ExampleForm from "./ExampleForm";
import { setSubmitted, updateChineseWord } from "@/stores/formSlice";
import { AppDispatch } from "@/stores/store";
import { setShouldScrollToStart } from "@/stores/formSlice";
const ChineseForm = () => {
  const theme = useTheme();
  const chineseSel = useAppSelector((state) => state.form.chinese);
  const [hanzi, setHanzi] = useState<string>(chineseSel.hanzi || "");
  const [pinyin, setPinyin] = useState<string>(chineseSel.pinyin || "");
  const [formality, setFormality] = useState<Formality>(
    chineseSel.formality || "formal"
  );
  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    chineseSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    chineseSel.definition || ""
  );
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartsOfSpeech>(
    chineseSel.type || "noun"
  );
  const [category, setCategory] = useState<string>(chineseSel.category || "");

  const [error, setError] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const dispatch = useAppDispatch<AppDispatch>();

  const options: PartsOfSpeech[] = [
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
    "conjunction",
    "interjection",
  ];
  const formalityArr: Formality[] = [
    "formal",
    "informal",
    "rude",
    "neutral",
    "polite",
    "casual",
  ];
  useEffect(() => {
    const wordData = {
      hanzi,
      pinyin,
      formality,
      burmeseMeaning,
      englishMeaning,
      partsOfSpeech,
      category,
    };
    dispatch(updateChineseWord({ language: "chinese", ...wordData }));
    setIsSubmitted(false);
  }, [
    hanzi,
    pinyin,
    formality,
    burmeseMeaning,
    englishMeaning,
    partsOfSpeech,
    category,
  ]);
  const inputs = [
    {
      label: "Hanzi",
      placeholder: "Enter kanji",
      value: hanzi,
      onChangeText: setHanzi,
    },
    {
      label: "Pinyin",
      placeholder: "Enter pinyin",
      value: pinyin,
      onChangeText: setPinyin,
    },

    {
      label: "Burmese Meaning",
      placeholder: "Enter burmese meaning",
      value: burmeseMeaning,
      onChangeText: setBurmeseMeaning,
    },
    {
      label: "English Meaning",
      placeholder: "Enter english meaning",
      value: englishMeaning,
      onChangeText: setEnglishMeaning,
    },
    {
      label: "Category",
      placeholder: "Enter category",
      value: category,
      onChangeText: setCategory,
    },
  ];
  const inputsAnim = useMemo(() => {
    return Array.from({ length: 5 }, () => new Animated.Value(0));
  }, []);
  useEffect(() => {
    Animated.stagger(
      150,
      Array.from({ length: 5 }, (_, index) =>
        Animated.spring(inputsAnim[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 5,
        })
      )
    ).start();
  }, []);

  return (
    <View>
      {inputsAnim.map((input, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: input,
            transform: [
              {
                translateY: input.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-40, 0],
                }),
              },
            ],
          }}
        >
          <InputBox
            label={inputs[index].label}
            placeholder={inputs[index].placeholder}
            value={inputs[index].value}
            onChangeText={inputs[index].onChangeText}
            error={isSubmitted && inputs[index].value === "" ? true : false}
          />
        </Animated.View>
      ))}
      <View className="w-full mb-4 gap-1 ">
        <Text className="text-sm" style={{ color: theme.mutedColor }}>
          Parts of Speech
        </Text>
        <SelectBox<PartsOfSpeech>
          selected={partsOfSpeech}
          onSelect={setPartsOfSpeech}
          options={options}
        />
      </View>
      <View className="w-full mb-4  gap-1 ">
        <Text className="text-sm " style={{ color: theme.mutedColor }}>
          Formality
        </Text>
        <SelectBox<Formality>
          selected={formality}
          onSelect={setFormality}
          options={formalityArr}
        />
      </View>
      <View className="flex-1">
        <ExampleForm language="chinese" />
      </View>
      <View className="flex-1 justify-center items-center ">
        <TouchableOpacity
          className="my-4 py-3  w-[60%] shadow-lg rounded-lg"
          style={{
            backgroundColor: theme.accentColor,
          }}
          onPress={() => {
            dispatch(setShouldScrollToStart(true));
            dispatch(setSubmitted(true));
            setIsSubmitted(true);
          }}
        >
          <Text
            className="text-lg text-center   "
            style={{
              color: "white",
            }}
          >
            Add Word
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChineseForm;
type InputBoxProps = {
  label: string;
  placeholder: string;
  value: string;
  error: boolean;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
};
const InputBox = ({
  label,
  placeholder,
  value,
  error,
  onChangeText,
}: InputBoxProps) => {
  const theme = useTheme();
  return (
    <View className="w-full  mb-4 gap-1">
      <Text className="text-sm" style={{ color: theme.mutedColor }}>
        {label}
      </Text>
      <TextInput
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        // placeholder={placeholder}

        className={`rounded-lg h-14 px-4 ${error ? "border" : ""}`}
      />
      {error && (
        <View className="gap-1 flex-row items-center">
          <AntDesign
            name="exclamationcircle"
            size={12}
            color={theme.dangerColor}
          />
          <Text className="text-red-400 text-sm">Required</Text>
        </View>
      )}
    </View>
  );
};
