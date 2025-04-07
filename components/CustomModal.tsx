import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  Alert,
} from "react-native";
import { Language, WordDetails } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { useTheme } from "@/hooks/Theme";
import Button from "./Button";
import CustomFormInput from "./CustomFormInput";
import { useSQLiteContext } from "expo-sqlite";
type inputData = {
  label: string;
  inputText: string;
};
type inputMapper = {
  [key: string]: string;
};

type Props = {
  data: inputData[];
  wordId: string;
  language: string;
  isVisible: boolean;
  transparent: boolean;
  animationType: "none" | "slide" | "fade" | undefined;
  closeModal: () => void;
  setWordData: React.Dispatch<
    React.SetStateAction<Partial<Record<Language, WordDetails>>>
  >;
};
const CustomModal = ({
  isVisible,
  transparent,
  animationType,
  data,
  wordId,
  language,
  closeModal,
  setWordData,
}: Props) => {
  const db = useSQLiteContext();
  const theme = useTheme();
  const modalHeight = data.length === 1 ? 30 : data.length === 2 ? 45 : 50;
  const [inputs, setInputs] = React.useState<inputMapper>({});
  const [changedValues, setChangedValues] = React.useState<string[]>([]);
  React.useEffect(() => {
    let modifiedData: inputMapper = {};
    data.map((data) => {
      modifiedData[data.label] = data.inputText;
    });

    setInputs(modifiedData);
  }, [data]);

  const confirmChanges = () => {
    Alert.alert(
      "Are you sure?",
      "You're about to edit information of the word.",
      [
        {
          text: "Yes,I'm sure",
          onPress: () => {
            updateData();
          },
        },
        {
          text: "cancel",
          style: "cancel",
        },
      ]
    );
    
  };
  const updateState = async () => {
    const word = await db.getFirstAsync(
      `SELECT * FROM ${language} JOIN word ON word.id = ${language}.word_id WHERE word.id = ${wordId} `
    );
    if (!word) throw `Word ${word} doesn't exist`;
    const examples = await db.getAllAsync(
      `SELECT * FROM ${language}_example WHERE word_id = ${wordId}`
    );
    setWordData((prev) => {
      return {
        ...prev,
        [language]: {
          word: { ...word, language },
          examples,
        },
      };
    });
  };
  const updateData = async () => {
    try {
      //update english defintion for the word
      if (Object.keys(inputs).includes("English")) {
        const newValue = Object.values(inputs)[0];
        await db.runAsync(`UPDATE word SET definition=? WHERE id=?`, [
          newValue,
          wordId,
        ]);
        updateState();
      }
      if (Object.keys(inputs).includes("Burmese")) {
        const newValue = Object.values(inputs)[0];
        await db.runAsync(`UPDATE word SET translation=? WHERE id=?`, [
          newValue,
          wordId,
        ]);
        updateState();
      }
      if (language === "japanese") {
        Object.values(inputs).forEach(async (value) => {
          try {
            const key = changedValues;
            if (key.includes("word")) {
              await db.runAsync(
                "UPDATE japanese SET kanji=? WHERE word_id=?;",
                [value, wordId]
              );
            }
            if (key.includes("phonetic")) {
              await db.runAsync(
                "UPDATE japanese SET hiragana=? WHERE word_id=?;",
                [value, wordId]
              );
            }
            if (key.includes("romaji")) {
              await db.runAsync(
                "UPDATE japanese SET romaji=? WHERE word_id=?;",
                [value, wordId]
              );
            }

            updateState();
          } catch (err) {
            console.log(err);
          }
        });
      } else if (language === "chinese") {
        Object.values(inputs).forEach(async (value) => {
          try {
            const key = changedValues;
            if (key.includes("word")) {
              await db.runAsync("UPDATE chinese SET hanzi=? WHERE word_id=?;", [
                value,
                wordId,
              ]);
            }
            if (key.includes("phonetic")) {
              await db.runAsync(
                "UPDATE chinese SET pinyin=? WHERE word_id=?;",
                [value, wordId]
              );
            }
            updateState();
          } catch (err) {
            console.log(err);
          }
        });
      } else {
        Object.values(inputs).forEach(async (value) => {
          try {
            const key = changedValues;
            if (key.includes("word")) {
              await db.runAsync(
                "UPDATE chinese SET hangul=? WHERE word_id=?;",
                [value, wordId]
              );
            }
            if (key.includes("phonetic")) {
              await db.runAsync(
                "UPDATE chinese SET romaji=? WHERE word_id=?;",
                [value, wordId]
              );
            }
            updateState();
          } catch (err) {
            console.log(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (value: inputData, index: number) => {
    const key = value.label;
    const text = value.inputText;
    setChangedValues((prev) => [...prev, key]);
    setInputs({ ...inputs, [key]: text });
  };
  return (
    <Modal
      visible={isVisible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={closeModal}
    >
      <View className="justify-end flex-1">
        <View
          className={`h-[${modalHeight}%] pt-4 px-4 pb-16`}
          style={{
            borderTopEndRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: theme.secondaryColor,
          }}
        >
          <View className="flex-row justify-between items-center">
            <Text
              className="text-[20px] text-center"
              style={{ color: theme.textColor }}
            >
              Edit
            </Text>
            <TouchableHighlight
              underlayColor={theme.secondaryColor}
              onPress={closeModal}
              className="rounded-lg p-2 w-[38px] h-[38px]  justify-start items-start"
            >
              <AntDesign
                name="closecircleo"
                size={24}
                color={theme.textColor}
              />
            </TouchableHighlight>
          </View>
          <View className="justify-center">
            <View
              className="border-2  p-4 mt-4 rounded-md gap-2 "
              style={{
                backgroundColor: theme.primaryColor,
                borderColor: theme.secondaryColor,
              }}
            >
              {Object.keys(inputs).map((key, i) => {
                return (
                  <CustomFormInput
                    key={i}
                    index={i}
                    value={inputs[key]}
                    label={key}
                    handleChange={handleChange}
                  />
                );
              })}

              <View className="justify-end  items-start  mt-4">
                <Button
                  title="Confirm"
                  onPress={confirmChanges}
                  bg={theme.accentColor}
                  color={theme.primaryColor}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({});
