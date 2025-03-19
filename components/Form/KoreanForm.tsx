import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import AntDesign from "@expo/vector-icons/AntDesign";

import { setSubmitted, updateKoreanWord } from "@/stores/formSlice";
import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState } from "react";
import SelectBox from "./SelectBox";
import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality } from "@/types";
import ExampleForm from "./ExampleForm";
import { setShouldScrollToStart } from "@/stores/formSlice";
const KoreanForm = () => {
  const theme = useTheme();
  const KoreanSel = useAppSelector((state) => state.form.korean);
  const [hangul, setHangul] = useState<string>(KoreanSel.hangul || "");
  const [romaji, setRomaji] = useState<string>(KoreanSel.romaji || "");
  const [formality, setFormality] = useState<Formality>(
    KoreanSel.formality || "formal"
  );
  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    KoreanSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    KoreanSel.definition || ""
  );
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartsOfSpeech>(
    KoreanSel.type || "noun"
  );
  const [category, setCategory] = useState<string>(KoreanSel.category || "");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const dispatch = useAppDispatch();

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
  React.useEffect(() => {
    const wordData = {
      hangul,
      romaji,
      category,
      partsOfSpeech,
      burmeseMeaning,
      englishMeaning,
      formality,
    };
    dispatch(updateKoreanWord({ language: "korean", ...wordData }));
    setIsSubmitted(false);
  }, [
    hangul,
    romaji,
    category,
    partsOfSpeech,
    burmeseMeaning,
    englishMeaning,
    formality,
  ]);
  const inputs = [
    {
      label: "Hangul",
      placeholder: "Enter Hangul",
      value: hangul,
      onChangeText: setHangul,
    },
    {
      label: "Romaji",
      placeholder: "Enter romaji",
      value: romaji,
      onChangeText: setRomaji,
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
  React.useEffect(() => {
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
      {inputsAnim.map((anim, index) => {
        return (
          <Animated.View
            key={index}
            style={{
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
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
              onChangeText={inputs[index].onChangeText}
              value={inputs[index].value}
              error={isSubmitted && inputs[index].value === "" ? true : false}
            />
          </Animated.View>
        );
      })}

      <View className=" mb-4 gap-1 w-full">
        <Text className="text-sm" style={{ color: theme.mutedColor }}>
          Parts of Speech
        </Text>
        <SelectBox<PartsOfSpeech>
          selected={partsOfSpeech}
          onSelect={setPartsOfSpeech}
          options={options}
        />
      </View>
      <View className="w-full mb-4 gap-1 ">
        <Text className="text-sm" style={{ color: theme.mutedColor }}>
          Formality
        </Text>
        <SelectBox<Formality>
          selected={formality}
          onSelect={setFormality}
          options={formalityArr}
        />
      </View>
      <View className="flex-1">
        <ExampleForm language="korean" />
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
        className={`rounded-lg h-14 px-4 ${error ? "border" : ""}`}
        // placeholder={placeholder}
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
export default KoreanForm;
