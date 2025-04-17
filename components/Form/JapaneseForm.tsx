import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Easing,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import Feather from "@expo/vector-icons/Feather";

import { useTheme } from "@/hooks/Theme";
import {
  PartsOfSpeech,
  Formality,
  stepMapper,
  JapaneseLevel,
  Frequency,
  SelectListItem,
} from "@/types";
import { useSqlite } from "@/hooks/Database";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import {
  setShouldScrollToStart,
  updateJapaneseWord,
  setSubmitted,
  setRequiredFields,
  setIsModalVisible,
} from "@/stores/formSlice";
import ExampleForm from "./ExampleForm";
import { RootState } from "@/stores/store";
const JapaneseForm = () => {
  const totalSteps = 2;
  const japaneseSel = useAppSelector((state: RootState) => state.form.japanese);
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const theme = useTheme();
  const { insertData } = useSqlite();
  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
  );

  const dispatch = useAppDispatch();
  const [word, setWord] = useState<string>(japaneseSel.word || "");
  const [pronunciation, setProununciation] = useState<string>(
    japaneseSel.pronunciation || ""
  );
  const [romaji, setRomaji] = useState<string>(japaneseSel.romaji || "");
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    React.useState<PartsOfSpeech>("noun");
  const [selectedFormality, setSelectedFormality] =
    useState<Formality>("neutral");

  const [burmese, setBurmese] = useState<string>(japaneseSel.burmese || "");
  const [english, setEnglish] = useState<string>(japaneseSel.definition || "");
  const [definition, setDefinition] = useState<string>("");
  const [categories, setCategories] = useState<string>("");
  const [level, setLevel] = useState<JapaneseLevel>("JLPT N5");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [frequency, setFrequency] = useState<Frequency>("medium");
  const [synonyms, setSynonyms] = useState<string>("");
  const [antonyms, setAntonyms] = useState<string>("");
  const partsOfSpeech: SelectListItem<PartsOfSpeech>[] = [
    {
      key: "1",
      value: "noun",
    },
    {
      key: "2",
      value: "pronoun",
    },
    {
      key: "3",
      value: "adjective",
    },
    {
      key: "4",
      value: "verb",
    },
    {
      key: "5",
      value: "adverb",
    },
    {
      key: "6",
      value: "preposition",
    },
    {
      key: "7",
      value: "conjunction",
    },
    {
      key: "8",
      value: "interjection",
    },
  ];
  const formality: SelectListItem<Formality>[] = [
    {
      key: "1",
      value: "formal",
    },
    {
      key: "2",
      value: "informal",
    },
    {
      key: "3",
      value: "neutral",
    },
    {
      key: "4",
      value: "casual",
    },
    {
      key: "5",
      value: "polite",
    },
    {
      key: "6",
      value: "rude",
    },
  ];
  const levels: SelectListItem<JapaneseLevel>[] = [
    {
      key: 1,
      value: "JLPT N5",
    },

    {
      key: 2,
      value: "JLPT N4",
    },

    {
      key: 3,
      value: "JLPT N3",
    },

    {
      key: 4,
      value: "JLPT N2",
    },

    {
      key: 5,
      value: "JLPT N1",
    },
  ];
  const frequencies: SelectListItem<Frequency>[] = [
    {
      key: 1,
      value: "very_low",
    },
    {
      key: 2,
      value: "low",
    },
    {
      key: 3,
      value: "medium",
    },
    {
      key: 4,
      value: "high",
    },
  ];

  const inputs = [
    {
      label: "Kanji",
      fieldName: "kanji",
      placeholder: "eg. 赤",
      value: word,
      onChangeText: setWord,
    },
    {
      label: "Hiragana/Furigana",
      fieldName: "hiragana",
      placeholder: "eg. あか",
      value: pronunciation,
      onChangeText: setProununciation,
    },
    {
      label: "Romaji",
      placeholder: "eg. aka",
      fieldName: "romaji",
      value: romaji,
      onChangeText: setRomaji,
    },

    {
      label: "Burmese",
      placeholder: "eg. အနီရောင်",
      fieldName: "burmese",
      value: burmese,
      onChangeText: setBurmese,
    },
    {
      label: "English",
      placeholder: "eg. red",
      fieldName: "english",
      value: english,
      onChangeText: setEnglish,
    },
    {
      label: "Definition in English(Optional)",
      placeholder: "e.g the color red",
      fieldName: "definition",
      value: definition,
      onChangeText: setDefinition,
      optional: true,
    },

    {
      label: "Category",
      placeholder: "eg. colors,symbols",
      fieldName: "categories",
      value: categories,
      onChangeText: setCategories,
    },
    {
      label: "Synonyms(Optional)",
      placeholder: "eg. 真紅,レッド",
      fieldName: "synonyms",
      value: synonyms,
      onChangeText: setSynonyms,
      optional: true,
    },
    {
      label: "Antonyms(Optional)",
      placeholder: "eg. 黒,青",
      fieldName: "antonyms",
      value: antonyms,
      onChangeText: setAntonyms,
      optional: true,
    },
  ];
  //restore previous state data
  useEffect(() => {
    const categories = japaneseSel.categories;
    if (Array.isArray(categories)) {
      setCategories(categories.join(","));
    }
  }, []);
  //update data as user type
  useEffect(() => {
    const japaneseData = {
      word,
      pronunciation,
      romaji,
      level,
      partsOfSpeech: selectedPartsOfSpeech,
      burmese,
      english,
      definition,
      categories,
      formality: selectedFormality,
      synonyms,
      antonyms,
      frequency,
    };

    if (isSubmitted) {
      //hide error when user start typing
      dispatch(setSubmitted(false));
    }
    updateRequiredFields();
    dispatch(updateJapaneseWord({ language: "japanese", ...japaneseData }));
  }, [
    word,
    pronunciation,
    romaji,
    selectedPartsOfSpeech,
    level,
    burmese,
    english,
    definition,
    categories,
    selectedFormality,
    frequency,
    antonyms,
    synonyms,
  ]);
  //check required fields
  const isAllInputsValid = (): boolean => {
    let isInputsRequired = Object.entries(requiredFields).some(
      ([key, value]) => {
        if (typeof value === "string" && value === "required") {
          console.log("required key:" + key);
          return true;
        }
        if (typeof value === "object") {
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            if (typeof nestedValue === "string" && nestedValue === "required") {
              console.log("required key in nested:" + key + "." + nestedKey);
              return true;
            }
          }
        }
        console.log("no required found");
        return false;
      }
    );

    return !isInputsRequired;
  };

  const updateRequiredFields = () => {
    inputs.forEach(({ fieldName, optional }, i) => {
      if (optional) return;
      const value = inputs[i].value;
      if (requiredFields[fieldName] === undefined) {
        dispatch(setRequiredFields({ [fieldName]: "required" }));
      } else {
        dispatch(
          setRequiredFields({
            [fieldName]: value === "" ? "required" : "",
          })
        );
      }
    });
  };

  //Animation Setup
  const inputBoxCount = inputs.length;
  const selectBoxCount = 4;
  const totalAnimationCount = inputBoxCount + selectBoxCount;
  const allAnimationRefs = useRef(
    [...Array(totalAnimationCount)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = allAnimationRefs.map((val) => {
      return Animated.timing(val, {
        useNativeDriver: true,
        toValue: 1,
        easing: Easing.out(Easing.ease),
      });
    });
    Animated.stagger(150, animations).start();
  }, [allAnimationRefs]);

  const getAnimationStyle = (animValue: Animated.Value) => {
    return {
      opacity: animValue,
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, 0],
          }),
        },
      ],
    };
  };

  const stepMap: stepMapper = {
    1: (
      <View>
        {inputs.map((input, i) => (
          <Animated.View key={i} style={getAnimationStyle(allAnimationRefs[i])}>
            <InputBox
              fieldName={input.fieldName}
              label={input.label}
              placeholder={input.placeholder}
              value={input.value}
              onChangeText={input.onChangeText}
            />
          </Animated.View>
        ))}
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[inputBoxCount])}
        >
          <SelectBox<Frequency>
            label="Frequency"
            data={frequencies}
            onSelected={setFrequency}
            value={frequency}
            fieldName="frequency"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[inputBoxCount + 1])}
        >
          <SelectBox<Formality>
            label="formality"
            data={formality}
            onSelected={setSelectedFormality}
            value={selectedFormality}
            fieldName="formality"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[inputBoxCount + 2])}
        >
          <SelectBox<PartsOfSpeech>
            label="parts of speech"
            data={partsOfSpeech}
            onSelected={setSelectedPartsOfSpeech}
            value={selectedPartsOfSpeech}
            fieldName="parts_of_speech"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[inputBoxCount + 3])}
        >
          <SelectBox<JapaneseLevel>
            label="level"
            data={levels}
            onSelected={setLevel}
            value={level}
            fieldName="level"
          />
        </Animated.View>
      </View>
    ),
    2: (
      <View className="flex-1">
        <ExampleForm language="japanese" />
      </View>
    ),
  };

  return (
    <View>
      {stepMap[currentStep]}
      <View className="flex-row items-center my-8 justify-around">
        <TouchableOpacity
          onPress={() => {
            setCurrentStep((prev) => prev - 1);
            dispatch(setShouldScrollToStart(true));
          }}
          className={currentStep === 1 ? "opacity-0" : "opacity-1"}
        >
          <Feather name="chevron-left" size={28} color={theme.textColor} />
        </TouchableOpacity>
        <Text>
          {currentStep} / {totalSteps}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setCurrentStep((prev) => prev + 1);
            dispatch(setShouldScrollToStart(true));
          }}
          className={
            currentStep === Object.keys(stepMap).length
              ? "opacity-0"
              : "opacity-1"
          }
        >
          <Feather name="chevron-right" size={28} color={theme.textColor} />
        </TouchableOpacity>
      </View>
      {currentStep === totalSteps && (
        <View className="flex-1 justify-center items-center ">
          <TouchableOpacity
            className="my-4 py-3  w-[100%] shadow-lg rounded-lg"
            style={{
              backgroundColor: theme.accentColor,
            }}
            onPress={async () => {
              dispatch(setSubmitted(true));
              updateRequiredFields();
              const isValid = isAllInputsValid();
              if (!isValid) {
                Alert.alert(
                  "Required Fields Are Missing",
                  "Please fill out all required fields to proceed next."
                );
              } else {
                const { success, lastInsertRow } = await insertData(
                  japaneseSel
                );
                if (success) {
                  dispatch(setIsModalVisible(false));
                }
              }
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
      )}
    </View>
  );
};
type SelectBoxProps<T> = {
  label: string;
  onSelected: React.Dispatch<React.SetStateAction<T>>;
  data: SelectListItem<T>[];
  fieldName: string;
  value: string;
};
function SelectBox<T>({
  label,
  onSelected,
  data,
  fieldName,
  value,
}: SelectBoxProps<T>) {
  const japaneseSel = useAppSelector((state: RootState) => state.form.japanese);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (japaneseSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (japaneseSel?.parts_of_speech !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if (japaneseSel?.level !== undefined)
      setSelected((prev) => [...prev, "level"]);
  }, [japaneseSel]);

  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const isUserSelected =
    selected.find((value) => value === fieldName) !== undefined;

  const theme = useTheme();
  return (
    <View className="  mb-4 gap-1">
      <Text className="text-sm" style={{ color: theme.mutedColor }}>
        {label}
      </Text>
      <SelectList
        search={false}
        defaultOption={{ key: value, value }}
        boxStyles={{
          backgroundColor: theme.primaryColor,
          borderStyle: "solid",
          borderWidth: isSubmitted && !isUserSelected ? 1 : 2,
          borderColor:
            isSubmitted && !isUserSelected
              ? theme.dangerColor
              : theme.secondaryColor,
        }}
        dropdownStyles={{ borderColor: theme.secondaryColor }}
        data={data}
        onSelect={() => {
          setSelected((prev) => [...prev, fieldName]);
        }}
        setSelected={(val: T) => {
          onSelected(val);
        }}
        save="value"
      />
      {isSubmitted && !isUserSelected && (
        <View className="gap-1 flex-row items-center">
          <Feather name="alert-triangle" size={24} color={theme.dangerColor} />
          <Text className="text-red-400 text-sm">Required</Text>
        </View>
      )}
    </View>
  );
}
type InputBoxProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;

  fieldName: string;
};
const InputBox = ({
  label,
  placeholder,
  value,
  onChangeText,

  fieldName,
}: InputBoxProps) => {
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
  );

  const theme = useTheme();

  return (
    <View className="w-full  mb-4 gap-1">
      <Text className="text-sm" style={{ color: theme.mutedColor }}>
        {label}
      </Text>
      <TextInput
        selectionColor={theme.dangerColor}
        cursorColor={theme.faintedColor}
        placeholderTextColor={theme.faintedColor}
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        className={`rounded-lg min-h-[40px] px-4 ${
          requiredFields[fieldName] === "required" && isSubmitted
            ? "border"
            : ""
        }`}
        placeholder={placeholder}
      />
      {isSubmitted && requiredFields[fieldName] === "required" && (
        <View className="gap-1 flex-row items-center">
          <Feather name="alert-triangle" size={14} color={theme.dangerColor} />
          <Text className="text-red-400 text-sm">Required</Text>
        </View>
      )}
    </View>
  );
};
export default JapaneseForm;
