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
import React, { useMemo, useState ,useEffect} from "react";

import { useTheme } from "@/hooks/Theme";
import { PartsOfSpeech, Formality ,KoreanLevel,stepMapper} from "@/types";
import ExampleForm from "./ExampleForm";
import { setShouldScrollToStart,setRequiredFields } from "@/stores/formSlice";
import { SelectList } from "react-native-dropdown-select-list";
import { RootState } from "@/stores/store";
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
  value: KoreanLevel;
}
const KoreanForm = () => {
  const totalSteps = 2;

  const theme = useTheme();
  const {addToTable} = useSqlite();
  const KoreanSel = useAppSelector((state) => state.form.korean);
  const [currentStep,setCurrentStep] = useState<number>(1);
  const [hangul, setHangul] = useState<string>(KoreanSel.hangul || "");
  const [romaji, setRomaji] = useState<string>(KoreanSel.romaji || "");
  const [selectedFormality, setSelectedFormality] = useState<Formality>(
    KoreanSel.formality || "formal"
  );
  const [burmeseMeaning, setBurmeseMeaning] = useState<string>(
    KoreanSel.translation || ""
  );
  const [englishMeaning, setEnglishMeaning] = useState<string>(
    KoreanSel.definition || ""
  );
  const [selectedPartsOfSpeech, setSelectedPartsOfSpeech] =
    useState<PartsOfSpeech>(KoreanSel.type || "noun");
  const [category, setCategory] = useState<string>(KoreanSel.category || "");
  
  const [level ,setLevel] = useState<KoreanLevel>("TOPIK 1");

  const dispatch = useAppDispatch();

  const requiredFields = useAppSelector((state:RootState) => state.form.requiredFields);
  const koreanSel = useAppSelector((state:RootState) => state.form.korean);
  const isSubmitted = useAppSelector((state: RootState) => state.form.isSubmitted)
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
      value: "TOPIK 1"
    },
 
    {
      key: 2,
      value: "TOPIK 2"
    },
  
    {
      key: 3,
      value: "TOPIK 3"
    },
 
    {
      key: 4,
      value: "TOPIK 4"
    },

    {
      key: 5,
      value: "TOPIK 5"
    },
    {
      key: 6,
      value: 'TOPIK 6'
    }
  ]
  React.useEffect(() => {
    const wordData = {
      hangul,
      romaji,
      category,
      type: selectedPartsOfSpeech,
      translation: burmeseMeaning,
      definition: englishMeaning,
      formality: selectedFormality,
      level
    };
    if(isSubmitted) {
      //hide errors when user start typing
      dispatch(setSubmitted(false))
    }
    dispatch(updateKoreanWord({ language: "korean", ...wordData }));
  }, [
    hangul,
    romaji,
    category,
    selectedPartsOfSpeech,
    burmeseMeaning,
    englishMeaning,
    selectedFormality,
    level
  ]);
  const inputs = [
    {
      label: "Hangul",
      placeholder: "Enter Hangul",
      value: hangul,
      fieldName : "hangul",
      onChangeText: setHangul,
    },
    {
      label: "Romaji",
      placeholder: "Enter romaji",
      value: romaji,
      fieldName : "romaji",
      onChangeText: setRomaji,
    },

    {
      label: "Burmese Meaning",
      placeholder: "Enter burmese meaning",
      value: burmeseMeaning,
      fieldName : "burmese",
      onChangeText: setBurmeseMeaning,
    },
    {
      label: "English Meaning",
      placeholder: "Enter english meaning",
      value: englishMeaning,
      fieldName : "english",
      onChangeText: setEnglishMeaning,
    },
    {
      label: "Category",
      placeholder: "Enter category",
      value: category,
      fieldName : "category",
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
        <SelectBox<KoreanLevel>
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
        <ExampleForm language="korean" />
      </View>
    ),
  }
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
          const {success,lastInsertRow} =await addToTable(koreanSel)
          if(success) {
            console.log("Added word successfully....")
            console.log("Last Insert RowId : " + lastInsertRow)
  
          }
        }
      }
  
      run();
    },[isSubmitted])
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
type SelectBoxProps<T extends PartsOfSpeech | Formality | KoreanLevel> = {
  label: string;
  onSelected: React.Dispatch<React.SetStateAction<T>>;
  data: SelectListPartsOfSpeech[] | SelectListFormality[] | SelectListLevel[];
  fieldName: string;
  value: string;
};
const SelectBox = <T extends PartsOfSpeech | Formality | KoreanLevel>({
  label,
  onSelected,
  data,
  fieldName,
  value,
}: SelectBoxProps<T>) => {
  const koreanSel = useAppSelector((state: RootState) => state.form.korean);
  const [selected, setSelected] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (koreanSel?.formality !== undefined)
      setSelected((prev) => [...prev, "formality"]);
    if (koreanSel?.type !== undefined)
      setSelected((prev) => [...prev, "partsOfSpeech"]);
    if( koreanSel?.level !== undefined) 
      setSelected((prev) => [...prev,"level"]);
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
        style={{
          backgroundColor: theme.secondaryColor,
          color: theme.textColor,
          borderColor: theme.dangerColor,
        }}
        value={value}
        onChangeText={(text) => onChangeText(text)}
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
export default KoreanForm;
