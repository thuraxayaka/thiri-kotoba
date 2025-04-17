import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";

import AntDesign from "@expo/vector-icons/AntDesign";

import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@/hooks/Theme";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { Example, Language } from "@/types";
import {
  removeRequiredFields,
  setShouldScrollToEnd,
  setSubmitted,
} from "@/stores/formSlice";
import {
  updateJapaneseWord,
  setRequiredFields,
  updateChineseWord,
  updateKoreanWord,
} from "@/stores/formSlice";
import { RootState } from "@/stores/store";

type Props = {
  language: Language;
};

type ExampleMapper = {
  [key: string]: Example;
};
const ExampleForm = ({ language }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state: RootState) => state.form[language]);
  const preExampleCount =
    selector.examples?.length === 0 ? 1 : selector.examples?.length ?? 2;
  const [exampleCount, setExampleCount] = useState<number>(preExampleCount);
  const [exampleData, setExampleData] = useState<ExampleMapper>({});
  const formSelector = useAppSelector((state: RootState) => state.form);
  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );

  const requiredFields = useAppSelector(
    (state: RootState) => state.form.requiredFields
  );

  useEffect(() => {
    const examples = formSelector[language].examples;
    if (examples)
      for (let i = 0; i < examples?.length; i++) {
        setExampleData((prev) => {
          return { ...prev, [`eg${i}`]: examples[i] };
        });
      }
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      for (let i = 0; i < exampleCount; i++) {
        if (exampleData[`eg${i}`] === undefined) {
          dispatch(
            setRequiredFields({
              [`eg${i}`]: {
                sentence: "required",
                pronunciation: "required",
                translation: "required",
              },
            })
          );
        } else {
          dispatch(
            setRequiredFields({
              [`eg${i}`]: {
                sentence:
                  exampleData[`eg${i}`].sentence !== "" ? "" : "required",
                pronunciation:
                  exampleData[`eg${i}`].pronunciation !== "" ? "" : "required",
                translation:
                  exampleData[`eg${i}`].translation !== "" ? "" : "required",
              },
            })
          );
        }
      }
    }
  }, [isSubmitted, exampleData, exampleCount]);
  useEffect(() => {
    const examples = [...Object.values(exampleData)];
    let exampleDataCount = examples.length;
    const emptyObj: Example = {
      pronunciation: "",
      translation: "",
      sentence: "",
    };
    while (exampleDataCount < exampleCount) {
      if (exampleDataCount === exampleCount) {
        break;
      }
      examples.push(emptyObj);
      exampleDataCount++;
    }
    switch (language) {
      case "japanese":
        dispatch(updateJapaneseWord({ examples }));
        break;
      case "chinese":
        dispatch(updateChineseWord({ examples }));
        break;
      case "korean":
        dispatch(updateKoreanWord({ examples }));
    }
    for (let [key, value] of Object.entries(requiredFields)) {
      if (typeof value === "object") {
        const keyIndex = parseInt(key.slice(2));
        if (keyIndex + 1 > exampleCount) {
          dispatch(removeRequiredFields(key));
        }
      }
    }
  }, [exampleCount]);
  useEffect(() => {
    const examples = Object.values(exampleData).map((value) => {
      return value;
    });
    switch (language) {
      case "japanese":
        dispatch(updateJapaneseWord({ examples }));
        break;
      case "chinese":
        dispatch(updateChineseWord({ examples }));
        break;
      case "korean":
        dispatch(updateKoreanWord({ examples }));
    }
  }, [exampleData]);

  const inputsAnim = useMemo(
    () =>
      Array.from({ length: exampleCount }).map((_, index) => {
        return new Animated.Value(0);
      }),

    [exampleCount]
  );
  React.useEffect(() => {
    Animated.stagger(
      5,
      Array.from({ length: exampleCount }).map((_, index) => {
        return Animated.spring(inputsAnim[index], {
          toValue: 1,
          tension: 40,
          friction: 2,
          useNativeDriver: true,
        });
      })
    ).start();
  }, [exampleCount]);
  return (
    <View>
      <View className="flex-row w-full mx-auto justify-between items-center my-4  pb-1">
        <Text className="text-md" style={{ color: theme.mutedColor }}>
          Examples
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              setExampleCount((prev) => (prev === 1 ? 1 : prev - 1));
            }}
          >
            <Feather name="minus-square" size={28} color={theme.faintedColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(setShouldScrollToEnd(true));
              setExampleCount((prev) => prev + 1);
            }}
          >
            <Feather name="plus-square" size={28} color={theme.faintedColor} />
          </TouchableOpacity>
        </View>
      </View>

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
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          >
            <View
              key={index}
              className={`  w-full items-center mx-auto gap-2 ${
                index == 0 ? "pt-0" : "pt-4"
              } pb-8`}
            >
              <View className="w-full gap-2">
                <Text style={{ color: theme.mutedColor }} className="text-sm">
                  Sentence
                </Text>
                <TextInput
                  multiline
                  placeholder={`eg. 彼女は赤いドレスを着ていた`}
                  className={`px-4 w-[100%] rounded-lg min-h-[60px] ${
                    requiredFields[`eg${index}`]?.sentence === "required" &&
                    isSubmitted
                      ? "border"
                      : ""
                  }`}
                  style={{
                    backgroundColor: theme.secondaryColor,
                    color: theme.textColor,
                    borderColor: theme.dangerColor,
                  }}
                  value={exampleData[`eg${index}`]?.sentence}
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[`eg${index}`] === undefined) {
                        return {
                          ...prev,
                          [`eg${index}`]: {
                            sentence: text,
                            translation: "",
                            pronunciation: "",
                          },
                        };
                      }
                      return {
                        ...prev,
                        [`eg${index}`]: {
                          sentence: text,
                          translation: prev[`eg${index}`].translation,
                          pronunciation: prev[`eg${index}`].pronunciation,
                        },
                      };
                    });
                    dispatch(setSubmitted(false));
                  }}
                ></TextInput>
                {requiredFields[`eg${index}`]?.sentence === "required" &&
                  isSubmitted && (
                    <View className="gap-1 flex-row items-center">
                      <Feather
                        name="alert-triangle"
                        size={16}
                        color={theme.dangerColor}
                      />
                      <Text className="text-red-400 text-sm">Required</Text>
                    </View>
                  )}
              </View>
              <View className="w-full gap-2">
                <Text style={{ color: theme.mutedColor }} className="text-sm">
                  Phonetic Transcription
                </Text>
                <TextInput
                  className={`px-4 w-[100%] rounded-lg py-4 min-h-[60px] ${
                    requiredFields[`eg${index}`]?.pronunciation ===
                      "required" && isSubmitted
                      ? "border"
                      : ""
                  }`}
                  multiline
                  style={{
                    backgroundColor: theme.secondaryColor,
                    color: theme.textColor,
                    borderColor: theme.dangerColor,
                  }}
                  placeholder="eg. Kanojo wa akai doresu o kite ita"
                  value={exampleData[`eg${index}`]?.pronunciation}
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[`eg${index}`] === undefined) {
                        return {
                          ...prev,
                          [`eg${index}`]: {
                            sentence: "",
                            translation: "",
                            pronunciation: text,
                          },
                        };
                      }
                      return {
                        ...prev,
                        [`eg${index}`]: {
                          sentence: prev[`eg${index}`].sentence,
                          translation: prev[`eg${index}`].translation,
                          pronunciation: text,
                        },
                      };
                    });
                    dispatch(setSubmitted(false));
                  }}
                ></TextInput>
                {requiredFields[`eg${index}`]?.pronunciation === "required" &&
                  isSubmitted && (
                    <View className="gap-1 flex-row items-center">
                      <Feather
                        name="alert-triangle"
                        size={16}
                        color={theme.dangerColor}
                      />
                      <Text className="text-red-400 text-sm">Required</Text>
                    </View>
                  )}
              </View>
              <View className="w-full gap-2">
                <Text style={{ color: theme.mutedColor }} className="text-sm">
                  Translation
                </Text>
                <TextInput
                  className={`px-4 w-[100%] rounded-lg py-1 min-h-[60px] ${
                    requiredFields[`eg${index}`]?.translation === "required" &&
                    isSubmitted
                      ? "border"
                      : ""
                  }`}
                  style={{
                    backgroundColor: theme.secondaryColor,
                    color: theme.textColor,
                    borderColor: theme.dangerColor,
                  }}
                  value={exampleData[`eg${index}`]?.translation}
                  placeholder="eg. She was wearing a red dress"
                  multiline
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[`eg${index}`] === undefined) {
                        return {
                          ...prev,
                          [`eg${index}`]: {
                            sentence: "",
                            translation: text,
                            pronunciation: "",
                          },
                        };
                      }
                      return {
                        ...prev,
                        [`eg${index}`]: {
                          sentence: prev[`eg${index}`].sentence,
                          translation: text,
                          pronunciation: prev[`eg${index}`].pronunciation,
                        },
                      };
                    });
                    dispatch(setSubmitted(false));
                  }}
                ></TextInput>

                {requiredFields[`eg${index}`]?.translation === "required" &&
                  isSubmitted && (
                    <View className="gap-1 flex-row items-center">
                      <Feather
                        name="alert-triangle"
                        size={16}
                        color={theme.dangerColor}
                      />
                      <Text className="text-red-400 text-sm">Required</Text>
                    </View>
                  )}
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default ExampleForm;
