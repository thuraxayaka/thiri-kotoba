import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SelectBox from "./SelectBox";
import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality } from "@/types";

import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { updateJapaneseWord } from "@/stores/formSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setShouldScrollToStart } from "@/stores/formSlice";

import ExampleForm from "./ExampleForm";

const AllForm = () => {
  const japaneseSel = useAppSelector((state) => state.form.japanese);
  const chineseSel = useAppSelector((state) => state.form.chinese);
  const KoreanSel = useAppSelector((state) => state.form.korean);
  const [kanji, setKanji] = useState<string>(japaneseSel.kanji || "");
  const [hiragana, setHiragana] = useState<string>(japaneseSel.hiragana || "");
  const [hanzi, setHanzi] = useState<string>(chineseSel.hanzi || "");
  const [pinyin, setPinyin] = useState<string>(chineseSel.pinyin || "");
  const [jromaji, setJRomaji] = useState<string>(japaneseSel.romaji || "");
  const [hangul, setHangul] = useState<string>(KoreanSel.hangul || "");
  const [kromaji, setKRomaji] = useState<string>(KoreanSel.romaji || "");
  const [partsOfSpeech, setPartsOfSpeech] = useState<PartsOfSpeech>(
    japaneseSel.type || "noun"
  );
  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    japaneseSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    japaneseSel.definition || ""
  );
  const [category, setCategory] = useState<string>(japaneseSel.category || "");
  const [formality, setFormality] = useState<Formality>(
    japaneseSel.formality || "formal"
  );
  const [currentStep, setCurrentStep] = useState<number>(0);

  const inputs = [
    {
      label: "Kanji",
      placeholder: "Enter kanji",
      value: kanji,
      onChangeText: setKanji,
    },
    {
      label: "Hiragana/Furigana",
      placeholder: "Enter hiragana or furigana",
      value: hiragana,
      onChangeText: setHiragana,
    },
    {
      label: "Romaji(japanese)",
      placeholder: "Enter romaji",
      value: jromaji,
      onChangeText: setJRomaji,
    },
    {
      label: "Hanzi",
      placeholder: "Enter Hanzi",
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
      label: "Hangul",
      placeholder: "Enter Hangul",
      value: hangul,
      onChangeText: setHangul,
    },
    {
      label: "Romaji(korean)",
      placeholder: "Enter romaji",
      value: kromaji,
      onChangeText: setKRomaji,
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

  const inputsAnim = useMemo(
    () => Array.from({ length: 8 }, () => new Animated.Value(0)),
    []
  );
  useEffect(() => {
    Animated.stagger(
      150,
      Array.from({ length: 8 }, (_, index) =>
        Animated.spring(inputsAnim[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 5,
        })
      )
    ).start();
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const data = {
      kanji,
      hiragana,
      jromaji,
      kromaji,
      hangul,
      hanzi,
      pinyin,
      partsOfSpeech,
      translation: burmeseMeaning,
      definition: englishMeaning,
      category,
      formality,
    };
    dispatch(updateJapaneseWord({ language: "japanese", ...data }));
  }, [
    kanji,
    hiragana,
    kromaji,
    jromaji,
    hangul,
    hanzi,
    pinyin,

    partsOfSpeech,
    burmeseMeaning,
    englishMeaning,
    category,
    formality,
  ]);
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
  ];

  const theme = useTheme();
  type stepMapper = {
    [key: number]: JSX.Element;
  };
  const steps: stepMapper = {
    0: (
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
            />
          </Animated.View>
        ))}

        <View className="  mb-4 gap-1">
          <Text className="text-sm" style={{ color: theme.mutedColor }}>
            Parts of Speech
          </Text>
          <SelectBox
            selected={partsOfSpeech}
            options={options}
            onSelect={setPartsOfSpeech}
          />
        </View>

        <View className="  mb-4 gap-1">
          <Text className="text-sm" style={{ color: theme.mutedColor }}>
            Formality
          </Text>
          <SelectBox<Formality>
            selected={formality}
            onSelect={setFormality}
            options={formalityArr}
          />
        </View>
      </View>
    ),
    1: <ExampleForm language="japanese" />,
    2: <ExampleForm language="chinese" />,
    3: <ExampleForm language="korean" />,
  };
  React.useEffect(() => {
    dispatch(setShouldScrollToStart(true));
  }, [currentStep]);

  return (
    <View>
      {steps[currentStep]}
      <View className="flex-row items-center  justify-around">
        <TouchableOpacity
          onPress={() => {
            setCurrentStep((prev) => prev - 1);
          }}
          className={currentStep === 0 ? "opacity-0" : "opacity-1"}
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text> {currentStep + 1} / 4</Text>
        <TouchableOpacity
          onPress={() => {
            setCurrentStep((prev) => prev + 1);
          }}
          className={
            currentStep === Object.keys(steps).length - 1
              ? "opacity-0"
              : "opacity-1"
          }
        >
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {currentStep === Object.keys(steps).length - 1 && (
        <TouchableOpacity
          className="my-4 py-2 w-[80%] mx-auto  shadow-lg rounded-lg"
          style={{
            backgroundColor: theme.accentColor,
          }}
          onPress={() => {}}
        >
          <Text
            className="text-lg text-center   "
            style={{
              color: "white",
            }}
          >
            Add
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

type InputBoxProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
};
const InputBox = ({
  label,
  placeholder,
  value,
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
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        className="rounded-lg h-14 px-4"
        // placeholder={placeholder}
      />
    </View>
  );
};
export default AllForm;
