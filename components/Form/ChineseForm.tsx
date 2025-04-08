import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality, stepMapper,ChineseLevel } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import ExampleForm from "./ExampleForm";
import { setSubmitted, updateChineseWord,setRequiredFields } from "@/stores/formSlice";
import { AppDispatch, RootState } from "@/stores/store";
import { setShouldScrollToStart } from "@/stores/formSlice";
import { SelectList } from "react-native-dropdown-select-list";
import { useSqlite } from "@/hooks/Database";
type SelectListPartsOfSpeech = {
  key: string | number;
  value: PartsOfSpeech;
};
type SelectListFormality = {
  key: string | number;
  value: Formality;
};
type SelectListLevel = {
  key: string | number;
  value: ChineseLevel
}

const ChineseForm = () => {
  const totalSteps = 2;
  const theme = useTheme();
  const {addToTable} = useSqlite();
  const chineseSel = useAppSelector((state) => state.form.chinese);
  const [hanzi, setHanzi] = useState<string>(chineseSel.hanzi || "");
  const [pinyin, setPinyin] = useState<string>(chineseSel.pinyin || "");
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    React.useState<PartsOfSpeech>("noun");
  const [selectedFormality, setSelectedFormality] =
    useState<Formality>("neutral");
  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    chineseSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    chineseSel.definition || ""
  )
  const [category, setCategory] = useState<string>(chineseSel.category || "");
  const [level,setLevel] = useState<ChineseLevel>("HSK 1");
  const [currentStep,setCurrentStep ] = useState<number>(1);
  const isSubmitted = useAppSelector((state:RootState) => state.form.isSubmitted);
  const dispatch = useAppDispatch<AppDispatch>();
  const requiredFields = useAppSelector((state:RootState) => state.form.requiredFields)
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
      value: "HSK 1"
    },
 
    {
      key: 2,
      value: "HSK 2"
    },
  
    {
      key: 3,
      value: "HSK 3"
    },
 
    {
      key: 4,
      value: "HSK 4"
    },

    {
      key: 5,
      value: "HSK 5"
    },

    {
      key: 5,
      value: "HSK 6"
    },
  ]
  
  useEffect(() => {
    const wordData = {
      hanzi,
      pinyin,
      level,
      formality: selectedFormality,
      translation: burmeseMeaning,
      definition: englishMeaning,
      type: selectedPartsOfSpeech,
      category,
    };
    if(isSubmitted) {
      //hide error when user start typing
      dispatch(setSubmitted(false));
    }
    dispatch(updateChineseWord({ language: "chinese", ...wordData }));
    
  }, [
    hanzi,
    pinyin,
    selectedFormality,
    burmeseMeaning,
    englishMeaning,
    selectedPartsOfSpeech,
    category,
    level
  ]);
  const inputs = [
    {
      label: "Hanzi",
      placeholder: "Enter kanji",
      value: hanzi,
      fieldName: "hanzi",
      onChangeText: setHanzi,
    },
    {
      label: "Pinyin",
      placeholder: "Enter pinyin",
      value: pinyin,
      fieldName: "pinyin",
      onChangeText: setPinyin,
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
      value: englishMeaning,
      fieldName: "english",
      onChangeText: setEnglishMeaning,
    },
    {
      label: "Category",
      placeholder: "Enter category",
      value: category,
      fieldName: "category",
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
     
      if(isValid) {
        const {success,lastInsertRow} =await addToTable(chineseSel)
        if(success) {
          console.log("Added word successfully....")
          console.log("Last Insert RowId : " + lastInsertRow)

        }
      }
    }

    run();
  },[isSubmitted])
  const stepMap : stepMapper = {
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
              <SelectBox<ChineseLevel>
                label="level"
                data={levels}
                onSelected={setLevel}
                value={level}
                fieldName="level"
              />
            </View>
    ),
    2:(
      <View className="flex-1">
        <ExampleForm language="chinese" />
      </View>
    ),
  }
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
              console.log("chinese selector: ")
              console.log(chineseSel); 
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
type SelectBoxProps<T extends PartsOfSpeech | Formality | ChineseLevel> = {
  label: string;
  onSelected: React.Dispatch<React.SetStateAction<T>>;
  data: SelectListPartsOfSpeech[] | SelectListFormality[] | SelectListLevel[];
  fieldName: string;
  value: string;
};
const SelectBox = <T extends PartsOfSpeech | Formality | ChineseLevel>({
  label,
  onSelected,
  data,
  fieldName,
  value,
}: SelectBoxProps<T>) => {
  const chineseSel = useAppSelector((state: RootState) => state.form.chinese);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (chineseSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (chineseSel?.type !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if( chineseSel?.level !== undefined) 
      setSelected((prev) => [...prev,"level"]);
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
  fieldName: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
};
const InputBox = ({
  label,
  placeholder,
  value,
  onChangeText,
  fieldName
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
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        // placeholder={placeholder}

        className={`rounded-lg h-14 px-4 ${
          requiredFields[fieldName] === "required" && isSubmitted
            ? "border"
            : ""
        }`}
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
