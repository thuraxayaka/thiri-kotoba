import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/Theme";
import {
  PartsOfSpeech,
  Formality,
  stepMapper,
  ChineseLevel,
  SelectListItem,
  Frequency,
} from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import ExampleForm from "./ExampleForm";
import {
  setSubmitted,
  updateChineseWord,
  setRequiredFields,
  setIsModalVisible,
} from "@/stores/formSlice";
import { AppDispatch, RootState } from "@/stores/store";
import { setShouldScrollToStart } from "@/stores/formSlice";
import { SelectList } from "react-native-dropdown-select-list";
import { useSqlite } from "@/hooks/Database";

const ChineseForm = () => {
  const totalSteps = 2;
  const theme = useTheme();
  const { insertData } = useSqlite();
  const chineseSel = useAppSelector((state) => state.form.chinese);
  const [word, setWord] = useState<string>(chineseSel.word || "");
  const [pinyin, setPinyin] = useState<string>(chineseSel.pronunciation || "");
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    React.useState<PartsOfSpeech>("noun");
  const [selectedFormality, setSelectedFormality] =
    useState<Formality>("neutral");
  const [burmese, setBurmese] = useState<string>(chineseSel.burmese || "");
  const [english, setEnglish] = useState<string>(chineseSel.definition || "");
  const [antonyms, setAntonyms] = useState<string>("");
  const [synonyms, setSynonyms] = useState<string>("");
  const [definition, setDefinition] = useState<string>("");
  const [categories, setCategories] = useState<string>("");
  const [level, setLevel] = useState<ChineseLevel>("HSK 1");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [frequency, setFrequency] = useState<Frequency>("medium");
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const dispatch = useAppDispatch<AppDispatch>();
  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
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
  const levels: SelectListItem<ChineseLevel>[] = [
    {
      key: 1,
      value: "HSK 1",
    },

    {
      key: 2,
      value: "HSK 2",
    },

    {
      key: 3,
      value: "HSK 3",
    },

    {
      key: 4,
      value: "HSK 4",
    },

    {
      key: 5,
      value: "HSK 5",
    },

    {
      key: 5,
      value: "HSK 6",
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
  //update as user types in
  useEffect(() => {
    const wordData = {
      word,
      pinyin,
      level,
      formality: selectedFormality,
      burmese,
      english,
      synonyms,
      antonyms,
      frequency,
      definition: english,
      partsOfSpeech: selectedPartsOfSpeech,
      categories,
    };
    if (isSubmitted) {
      //hide error when user start typing
      dispatch(setSubmitted(false));
    }
    updateRequiredFields();
    dispatch(updateChineseWord({ language: "chinese", ...wordData }));
  }, [
    word,
    pinyin,
    selectedFormality,
    burmese,
    english,
    antonyms,
    synonyms,
    definition,
    selectedPartsOfSpeech,
    categories,
    frequency,
    level,
  ]);
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

        return false;
      }
    );

    return !isInputsRequired;
  };
  //checking if inputs valid
  useEffect(() => {
    async function run() {
      const isValid = isAllInputsValid();
      if (isValid) {
        const { success, lastInsertRow } = await insertData(chineseSel);
        console.log("success" + success);
        if (success) {
          console.log("Added word successfully....");
          console.log("Last Insert RowId : " + lastInsertRow);
        }
      }
    }

    run();
  }, [isSubmitted]);
  //inputs fields
  const inputs = [
    {
      label: "Hanzi",
      placeholder: "eg. 大人",
      value: word,
      fieldName: "word",
      onChangeText: setWord,
    },
    {
      label: "Pinyin",
      placeholder: "eg. dàren",
      value: pinyin,
      fieldName: "pinyin",
      onChangeText: setPinyin,
    },

    {
      label: "Burmese",
      placeholder: "eg. လူကြီး",
      fieldName: "burmese",
      value: burmese,
      onChangeText: setBurmese,
    },
    {
      label: "English",
      placeholder: "eg. adult",
      value: english,
      fieldName: "english",
      onChangeText: setEnglish,
    },
    {
      label: "Definition in English(Optional)",
      placeholder: "eg. A person who is fully grown",
      value: definition,
      fieldName: "definition",
      onChangeText: setDefinition,
      optional: true,
    },
    {
      label: "Category",
      placeholder: "eg. people,etc.",
      value: categories,
      fieldName: "categories",
      onChangeText: setCategories,
    },
    {
      label: "Synonyms(Optional)",
      placeholder: "eg. 成年人,成人",
      value: synonyms,
      fieldName: "synonyms",
      onChangeText: setSynonyms,
      optional: true,
    },
    {
      label: "Antonyms(Optional)",
      placeholder: "eg. 成年人,成人",
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
  //Animation setup
  const totalInputs = inputs.length;
  const selectboxes = 4;
  const totalItemsToAnimate = totalInputs + selectboxes;
  const allAnimationsRefs = useRef(
    [...Array(totalItemsToAnimate)].map((val) => new Animated.Value(0))
  ).current;
  useEffect(() => {
    const animations = allAnimationsRefs.map((val) => {
      return Animated.timing(val, {
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
        toValue: 1,
      });
    });
    Animated.stagger(150, animations).start();
  }, [allAnimationsRefs]);
  //Animated helper function
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
          <Animated.View
            key={i}
            style={getAnimationStyle(allAnimationsRefs[i])}
          >
            <InputBox
              fieldName={input.fieldName}
              placeholder={input.placeholder}
              value={input.value}
              onChangeText={input.onChangeText}
              label={input.label}
            />
          </Animated.View>
        ))}
        <Animated.View
          style={getAnimationStyle(allAnimationsRefs[totalInputs])}
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
          style={getAnimationStyle(allAnimationsRefs[totalInputs + 1])}
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
          style={getAnimationStyle(allAnimationsRefs[totalInputs + 2])}
        >
          <SelectBox<ChineseLevel>
            label="level"
            data={levels}
            onSelected={setLevel}
            value={level}
            fieldName="level"
          />
        </Animated.View>
        <Animated.View
          style={getAnimationStyle(allAnimationsRefs[totalInputs + 3])}
        >
          <SelectBox<Frequency>
            label="frequency"
            data={frequencies}
            onSelected={setFrequency}
            value={frequency}
            fieldName="frequency"
          />
        </Animated.View>
      </View>
    ),
    2: (
      <View className="flex-1">
        <ExampleForm language="chinese" />
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
              console.log(chineseSel);
              if (!isValid) {
                Alert.alert(
                  "Required Fields Are Missing",
                  "Please fill out all required fields to proceed next."
                );
              } else {
                const { success, lastInsertRow } = await insertData(chineseSel);
                if (success) {
                  dispatch(setIsModalVisible(false));
                } else {
                  console.log("error inserting to chinese_word. Chinese form");
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

export default ChineseForm;
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
  const chineseSel = useAppSelector((state: RootState) => state.form.chinese);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (chineseSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (chineseSel?.parts_of_speech !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if (chineseSel?.level !== undefined)
      setSelected((prev) => [...prev, "level"]);
  }, [chineseSel]);

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
          <Feather name="alert-triangle" size={14} color={theme.dangerColor} />
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
        placeholderTextColor={theme.faintedColor}
        selectionColor={theme.dangerColor}
        cursorColor={theme.faintedColor}
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        className={`rounded-lg py-4 min-h-[40px] px-4 ${
          requiredFields[fieldName] === "required" && isSubmitted
            ? "border"
            : ""
        }`}
        placeholder={placeholder}
        multiline
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
