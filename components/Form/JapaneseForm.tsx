import {
  Text,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { SelectList } from "react-native-dropdown-select-list";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality, stepMapper,JapaneseLevel } from "@/types"
import { useSqlite } from "@/hooks/Database";
// import { useSQLiteContext } from "expo-sqlite";

import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import {
  setShouldScrollToStart,
  updateJapaneseWord,
  setSubmitted,
  setRequiredFields,
} from "@/stores/formSlice";
import ExampleForm from "./ExampleForm";
import { RootState } from "@/stores/store";
type SelectListPartsOfSpeech = {
  key: string | number;
  value: PartsOfSpeech;
};
type SelectListFormality = {
  key: string | number;
  value: Formality;
};
type SelectListLevel = {
  key: number;
  value: JapaneseLevel
}

const JapaneseForm = () => {
  // const db = useSQLiteContext();
  const totalSteps = 2;
  const japaneseSel = useAppSelector((state: RootState) => state.form.japanese);
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  const {addToTable }  = useSqlite();

  const requiredFields = useAppSelector((state : RootState ) =>  state.form.requiredFields);
 

  const dispatch = useAppDispatch();
  const [kanji, setKanji] = useState<string>(japaneseSel.kanji || "");
  const [hiragana, setHiragana] = useState<string>(japaneseSel.hiragana || "");
  const [romaji, setRomaji] = useState<string>(japaneseSel.romaji || "");
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    React.useState<PartsOfSpeech>("noun");
  const [selectedFormality, setSelectedFormality] =
    useState<Formality>("neutral");

  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    japaneseSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    japaneseSel.definition || ""
  );
  const [category, setCategory] = useState<string>(japaneseSel.category || "");

  const [level,setLevel] = useState<JapaneseLevel>("JLPT N5");
  const [currentStep, setCurrentStep] = useState<number>(1);
  

  const partsOfSpeech: SelectListPartsOfSpeech[] = [
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
  const formality: SelectListFormality[] = [
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
const levels: SelectListLevel[] =  [
    {
      key: 1,
      value: "JLPT N5"
    },
 
    {
      key: 2,
      value: "JLPT N4"
    },
  
    {
      key: 3,
      value: "JLPT N3"
    },
 
    {
      key: 4,
      value: "JLPT N2"
    },

    {
      key: 5,
      value: "JLPT N1"
    },
  ]
  
  const inputs = [
    {
      label: "Kanji",
      fieldName: "kanji",
      placeholder: "Enter kanji",
      value: kanji,
      onChangeText: setKanji,
    },
    {
      label: "Hiragana/Furigana",
      fieldName: "hiragana",
      placeholder: "Enter hiragana or furigana",
      value: hiragana,
      onChangeText: setHiragana,
    },
    {
      label: "Romaji",
      placeholder: "Enter romaji",
      fieldName: "romaji",
      value: romaji,
      onChangeText: setRomaji,
    },

    {
      label: "Burmese Meaning",
      placeholder: "Enter burmese meaning",
      fieldName: "burmese",
      value: burmeseMeaning,
      onChangeText: setBurmeseMeaning,
    },
    {
      label: "English Meaning",
      placeholder: "Enter english meaning",
      fieldName: "english",
      value: englishMeaning,
      onChangeText: setEnglishMeaning,
    },
    {
      label: "Category",
      placeholder: "Enter category",
      fieldName: "category",
      value: category,
      onChangeText: setCategory,
    }
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

  useEffect(() => {
    const japaneseData = {
      kanji,
      hiragana,
      romaji,
      level,
      type: selectedPartsOfSpeech,
      translation: burmeseMeaning,
      definition: englishMeaning,
      category,
      formality: selectedFormality,
    };
    if (isSubmitted) {
      //hide error when user start typing
      dispatch(setSubmitted(false));
    }
    dispatch(updateJapaneseWord({ language: "japanese", ...japaneseData }));
  }, [
    kanji,
    hiragana,
    romaji,
    selectedPartsOfSpeech,
    level,
    burmeseMeaning,
    englishMeaning,
    category,
    selectedFormality,
  ]);

  useEffect(() => {
    async function isAllInputsValid(): Promise<boolean> {
      if(isSubmitted) {
        let isInputsRequired = Object.entries(requiredFields).some(([key,value],index) => {
          if(typeof value === "string" && value === 'required') {
            return true;
          }
          if(typeof value === 'object') {
            for([key,value] of Object.entries(value)) {
              if(typeof value === 'string' && value === 'required') {
                return true;
              }
            }
          }
          return false;
        })

        return !isInputsRequired;
      }
      return false;
    }
    async function run() {
      const isValid = await isAllInputsValid();
      console.log(japaneseSel)
      if(isValid) {
        const {success,lastInsertRow} =await addToTable(japaneseSel)
        if(success) {
          console.log("Added word successfully....")
          console.log("Last Insert RowId : " + lastInsertRow)

        }
      }
    }

    run();
  },[isSubmitted])


  const theme = useTheme();

  const stepMap: stepMapper = {
    1: (
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
              fieldName={inputs[index].fieldName}
              label={inputs[index].label}
              placeholder={isSubmitted ? "please fill out this field" : ""}
              value={inputs[index].value}
              onChangeText={inputs[index].onChangeText}
            />
          </Animated.View>
        ))}
        <SelectBox<Formality>
          label="formality"
          data={formality}
          onSelected={setSelectedFormality}
          value={selectedFormality}
          fieldName="formality"
        />
        <SelectBox<PartsOfSpeech>
          label="parts of speech"
          data={partsOfSpeech}
          onSelected={setSelectedPartsOfSpeech}
          value={selectedPartsOfSpeech}
          fieldName="partsOfSpeech"
        />
        <SelectBox<JapaneseLevel>
          label="level"
          data={levels}
          onSelected={setLevel}
          value={level}
          fieldName="level"
        />
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
          <AntDesign name="left" size={24} color="black" />
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
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {currentStep === totalSteps && (
        <View className="flex-1 justify-center items-center ">
          <TouchableOpacity
            className="my-4 py-3  w-[100%] shadow-lg rounded-lg"
            style={{
              backgroundColor: theme.accentColor,
            }}
            onPress={() => {
              dispatch(setShouldScrollToStart(true));
              dispatch(setSubmitted(true));
              
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
type SelectBoxProps<T extends PartsOfSpeech | Formality | JapaneseLevel> = {
  label: string;
  onSelected: React.Dispatch<React.SetStateAction<T>>;
  data: SelectListPartsOfSpeech[] | SelectListFormality[] | SelectListLevel[];
  fieldName: string;
  value: string;
};
const SelectBox = <T extends PartsOfSpeech | Formality | JapaneseLevel>({
  label,
  onSelected,
  data,
  fieldName,
  value,
}: SelectBoxProps<T>) => {
  const japaneseSel = useAppSelector((state: RootState) => state.form.japanese);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (japaneseSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (japaneseSel?.type !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if( japaneseSel?.level !== undefined) 
      setSelected((prev) => [...prev,"level"]);
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
        placeholderTextColor={value ? theme.mutedColor : theme.dangerColor}
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        className={`rounded-lg h-14 px-4 ${
          requiredFields[fieldName] === "required" && isSubmitted
            ? "border"
            : ""
        }`}
        // placeholder={placeholder}
      />
      {isSubmitted && requiredFields[fieldName] === "required" && (
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
