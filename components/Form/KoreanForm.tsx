import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import Feather from "@expo/vector-icons/Feather";

import { setSubmitted, updateKoreanWord } from "@/stores/formSlice";
import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Easing,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { useTheme } from "@/hooks/Theme";
import {
  PartsOfSpeech,
  Formality,
  KoreanLevel,
  stepMapper,
  SelectListItem,
  Frequency,
} from "@/types";
import ExampleForm from "./ExampleForm";
import {
  setIsModalVisible,
  setShouldScrollToStart,
  setRequiredFields,
} from "@/stores/formSlice";
import { SelectList } from "react-native-dropdown-select-list";
import { RootState } from "@/stores/store";
import { useSqlite } from "@/hooks/Database";

const KoreanForm = () => {
  const totalSteps = 2;
  const theme = useTheme();
  const { insertData } = useSqlite();
  const koreanSel = useAppSelector((state) => state.form.korean);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [word, setWord] = useState<string>("");
  const [romaji, setRomaji] = useState<string>("");
  const [selectedFormality, setSelectedFormality] =
    useState<Formality>("formal");
  const [burmese, setBurmese] = useState<string>("");
  const [definition, setDefinition] = useState<string>("");
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    useState<PartsOfSpeech>("noun");
  const [categories, setCategories] = useState<string>("");
  const [level, setLevel] = useState<KoreanLevel>("TOPIK 1");
  const [frequency, setFrequency] = useState<Frequency>("medium");
  const [english, setEnglish] = useState<string>("");
  const [synonyms, setSynonyms] = useState<string>("");
  const [antonyms, setAntonyms] = useState<string>("");
  const dispatch = useAppDispatch();

  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
  );

  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
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
  const levels: SelectListItem<KoreanLevel>[] = [
    {
      key: 1,
      value: "TOPIK 1",
    },

    {
      key: 2,
      value: "TOPIK 2",
    },

    {
      key: 3,
      value: "TOPIK 3",
    },

    {
      key: 4,
      value: "TOPIK 4",
    },

    {
      key: 5,
      value: "TOPIK 5",
    },
    {
      key: 6,
      value: "TOPIK 6",
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
  //update data as user types in
  React.useEffect(() => {
    const wordData = {
      word,
      romaji,
      categories,
      partsOfSpeech: selectedPartsOfSpeech,
      burmese,
      english,
      frequency,
      definition,
      formality: selectedFormality,
      level,
    };
    if (isSubmitted) {
      //hide errors when user start typing
      dispatch(setSubmitted(false));
    }
    updateRequiredFields();
    dispatch(updateKoreanWord({ language: "korean", ...wordData }));
  }, [
    word,
    romaji,
    categories,
    selectedPartsOfSpeech,
    burmese,
    english,
    definition,
    selectedFormality,
    level,
    frequency,
  ]);
  //restore previous user typed data
  React.useEffect(() => {
    const categories = koreanSel.categories;
    if (Array.isArray(categories)) setCategories(categories.join(","));
    if (koreanSel.word) setWord(koreanSel.word);
    if (koreanSel.parts_of_speech)
      setSelectedPartsOfSpeech(koreanSel.parts_of_speech as PartsOfSpeech);
    if (koreanSel.burmese) setBurmese(koreanSel.burmese);
    if (koreanSel.english) setEnglish(koreanSel.english);
    if (koreanSel.formality)
      setSelectedFormality(koreanSel.formality as Formality);
    if (koreanSel.level) setLevel(koreanSel.level as KoreanLevel);
  }, []);
  const inputs = [
    {
      label: "Hangul",
      placeholder: "eg. 선생님",
      value: word,
      fieldName: "word",
      onChangeText: setWord,
    },
    {
      label: "Romaji",
      placeholder: "eg. seon saeng nim",
      value: romaji,
      fieldName: "romaji",
      onChangeText: setRomaji,
    },

    {
      label: "Burmese",
      placeholder: "eg. ဆရာ/ဆရာမ",
      value: burmese,
      fieldName: "burmese",
      onChangeText: setBurmese,
    },
    {
      label: "English",
      placeholder: "eg. teacher",
      value: english,
      fieldName: "english",
      onChangeText: setEnglish,
    },
    {
      label: "Definition in English",
      placeholder: "eg. A person who teaches",
      value: definition,
      fieldName: "definition",
      onChangeText: setDefinition,
      optional: true,
    },
    {
      label: "Category",
      placeholder: "eg. occupation,people",
      value: categories,
      fieldName: "categories",
      onChangeText: setCategories,
    },
    {
      label: "Synonyms(Optional)",
      placeholder: "eg. 교사",
      value: synonyms,
      fieldName: "synonyms",
      onChangeText: setSynonyms,
      optional: true,
    },
    {
      label: "Antonyms(Optional)",
      placeholder: "eg. 학생",
      value: antonyms,
      fieldName: "antonyms",
      onChangeText: setAntonyms,
      optional: true,
    },
  ];
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

  //setup animation
  const totalInputs = inputs.length;
  const totalSelectBox = 4;
  const totalAnimatedItem = totalInputs + totalSelectBox;
  const allAnimationRefs = useRef(
    [...Array(totalAnimatedItem)].map((val) => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = allAnimationRefs.map((val) => {
      return Animated.timing(val, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      });
    });
    Animated.stagger(150, animations).start();
  }, [allAnimationRefs]);

  //animation helper function
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
              value={input.value}
              placeholder={input.placeholder}
              onChangeText={input.onChangeText}
              label={input.label}
              fieldName={input.fieldName}
            />
          </Animated.View>
        ))}
        <Animated.View style={getAnimationStyle(allAnimationRefs[totalInputs])}>
          <SelectBox<Formality>
            label="formality"
            data={formality}
            onSelected={setSelectedFormality}
            value={selectedFormality}
            fieldName="formality"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[totalInputs + 1])}
        >
          <SelectBox<PartsOfSpeech>
            label="parts of speech"
            data={partsOfSpeech}
            onSelected={setSelectedPartsOfSpeech}
            value={selectedPartsOfSpeech}
            fieldName="partsOfSpeech"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[totalInputs + 2])}
        >
          <SelectBox<KoreanLevel>
            label="level"
            data={levels}
            onSelected={setLevel}
            value={level}
            fieldName="level"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationRefs[totalInputs + 3])}
        >
          <SelectBox<Frequency>
            label="level"
            data={frequencies}
            onSelected={setFrequency}
            value={frequency}
            fieldName="level"
          />
        </Animated.View>
      </View>
    ),
    2: (
      <View className="flex-1">
        <ExampleForm language="korean" />
      </View>
    ),
  };
  //check all inputs are valid
  useEffect(() => {
    async function isAllInputsValid(): Promise<boolean> {
      if (isSubmitted) {
        let isInputsRequired = Object.entries(requiredFields).some(
          ([key, value], index) => {
            if (typeof value === "string" && value === "required") {
              return true;
            }
            if (typeof value === "object") {
              for ([key, value] of Object.entries(value)) {
                if (typeof value === "string" && value === "required") {
                  return true;
                }
              }
            }
            return false;
          }
        );

        return !isInputsRequired;
      }
      return false;
    }
    async function run() {
      const isValid = await isAllInputsValid();

      if (isValid) {
        const { success, lastInsertRow } = await insertData(koreanSel);
        if (success) {
          console.log("Added word successfully....");
          console.log("Last Insert RowId : " + lastInsertRow);
        }
      }
    }

    run();
  }, [isSubmitted]);
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
          <Feather name="chevron-left" size={24} color="black" />
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
          <Feather name="chevron-right" size={24} color="black" />
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
              console.log(koreanSel);
              if (!isValid) {
                Alert.alert(
                  "Required Fields Are Missing",
                  "Please fill out all required fields to proceed next."
                );
              } else {
                const { success, lastInsertRow } = await insertData(koreanSel);
                if (success) {
                  console.log(lastInsertRow);
                  dispatch(setIsModalVisible(false));
                } else {
                  console.log("error inserting to korean_word. Korean form");
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
  fieldName: string;
  data: SelectListItem<T>[];
  value: string;
};
function SelectBox<T>({
  label,
  onSelected,
  data,
  fieldName,
  value,
}: SelectBoxProps<T>) {
  const koreanSel = useAppSelector((state: RootState) => state.form.korean);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (koreanSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (koreanSel?.parts_of_speech !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if (koreanSel?.level !== undefined)
      setSelected((prev) => [...prev, "level"]);
  }, [koreanSel]);

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
          <Feather name="alert-triangle" size={16} color={theme.dangerColor} />
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
  fieldName: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
};
const InputBox = ({
  label,
  placeholder,
  value,
  fieldName,
  onChangeText,
}: InputBoxProps) => {
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
  );

  const dispatch = useAppDispatch();
  const theme = useTheme();
  useEffect(() => {
    if (isSubmitted) {
      if (requiredFields[fieldName] === undefined) {
        dispatch(setRequiredFields({ [fieldName]: "required" }));
      } else {
        dispatch(
          setRequiredFields({
            [fieldName]: value === "" ? "required" : "",
          })
        );
      }
    }
  }, [isSubmitted]);
  return (
    <View className="w-full  mb-4 gap-1">
      <Text className="text-sm" style={{ color: theme.mutedColor }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={theme.mutedColor}
        selectionColor={theme.accentColor}
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        className={`rounded-lg min-h-[50px] px-4 ${
          requiredFields[fieldName] === "required" && isSubmitted
            ? "border"
            : ""
        }`}
        placeholder={placeholder}
        multiline
      />
      {isSubmitted && requiredFields[fieldName] === "required" && (
        <View className="gap-1 flex-row items-center">
          <Feather name="alert-triangle" size={16} color={theme.dangerColor} />
          <Text className="text-red-400 text-sm">Required</Text>
        </View>
      )}
    </View>
  );
};
export default KoreanForm;
