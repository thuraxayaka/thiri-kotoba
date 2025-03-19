import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import SelectBox from "./SelectBox";
import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality } from "@/types";
import { setSubmitted } from "@/stores/formSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { setShouldScrollToStart, updateJapaneseWord } from "@/stores/formSlice";
import ExampleForm from "./ExampleForm";

const JapaneseForm = () => {
  const japaneseSel = useAppSelector((state) => state.form.japanese);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [kanji, setKanji] = useState<string>(japaneseSel.kanji || "");
  const [hiragana, setHiragana] = useState<string>(japaneseSel.hiragana || "");
  const [romaji, setRomaji] = useState<string>(japaneseSel.romaji || "");
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

  const inputsAnim = useMemo(
    () => Array.from({ length: 6 }, () => new Animated.Value(0)),
    []
  );
  useEffect(() => {
    Animated.stagger(
      150,
      Array.from({ length: 6 }, (_, index) =>
        Animated.spring(inputsAnim[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 15,
        })
      )
    ).start();
  }, []);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const japaneseData = {
      kanji,
      hiragana,
      romaji,
      partsOfSpeech,
      translation: burmeseMeaning,
      definition: englishMeaning,
      category,
      formality,
    };
    if (isSubmitted) setIsSubmitted(false); //hide error when user start typing
    dispatch(updateJapaneseWord({ language: "japanese", ...japaneseData }));
  }, [
    kanji,
    hiragana,
    romaji,
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
            placeholder={isSubmitted ? "please fill out this field" : ""}
            value={inputs[index].value}
            onChangeText={inputs[index].onChangeText}
            error={isSubmitted && inputs[index].value === "" ? true : false}
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

      <View className="flex-1">
        <ExampleForm language="japanese" />
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
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
};
const InputBox = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}: InputBoxProps) => {
  const theme = useTheme();
  return (
    <View className="w-full  mb-4 gap-1">
      <Text className="text-sm" style={{ color: theme.mutedColor }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={value ? theme.mutedColor : theme.dangerColor}
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
            className="text-rose-400"
          />
          <Text className="text-red-400 text-sm">Required</Text>
        </View>
      )}
    </View>
  );
};
export default JapaneseForm;
