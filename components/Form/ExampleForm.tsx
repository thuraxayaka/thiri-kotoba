import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";

import AntDesign from "@expo/vector-icons/AntDesign";

import { EvilIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/Theme";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { Example, Language } from "@/types";
import { setShouldScrollToEnd } from "@/stores/formSlice";
import { updateJapaneseWord } from "@/stores/formSlice";
import { RootState } from "@/stores/store";

type Props = {
  language: Language;
};
const ExampleForm = ({ language }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [exampleCount, setExampleCount] = useState<number>(3);
  const [exampleData, setExampleData] = useState<Example[]>([]);
  const [error, setError] = useState<boolean>(false);

  const isSubmitted = useAppSelector(
    (state: RootState) => state.form.isSubmitted
  );
  useEffect(() => {
    dispatch(updateJapaneseWord({ examples: exampleData }));
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
      100,
      Array.from({ length: exampleCount }).map((_, index) => {
        return Animated.spring(inputsAnim[index], {
          speed: 5,
          toValue: 1,
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
            <EvilIcons name="minus" size={35} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(setShouldScrollToEnd(true));
              setExampleCount((prev) => prev + 1);
            }}
          >
            <EvilIcons name="plus" size={35} color="black" />
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
                    outputRange: [-40, 0],
                  }),
                },
              ],
            }}
          >
            <View
              key={index}
              className={`  w-full items-center mx-auto gap-2 ${
                index == 0 ? "pt-0" : "pt-4"
              } pb-4`}
            >
              <View className="w-full gap-2">
                <Text style={{ color: theme.mutedColor }} className="text-sm">
                  Sentence
                </Text>
                <TextInput
                  multiline
                  placeholder={`example ${index + 1}`}
                  className="px-4 w-[100%] rounded-lg py-4"
                  style={{ backgroundColor: theme.secondaryColor }}
                  value={exampleData[index]?.sentence}
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[index] === undefined) {
                        return [
                          ...prev,
                          { sentence: text, translation: "", phonetic: "" },
                        ];
                      }
                      return [
                        ...prev.map((item, i) => {
                          if (i === index) {
                            return { ...item, sentence: text };
                          }

                          return item;
                        }),
                      ];
                    });
                  }}
                ></TextInput>
                {error && (
                  <View className="gap-1 flex-row items-center">
                    <AntDesign
                      name="exclamationcircle"
                      size={12}
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
                  className="px-4 py-4 rounded-lg w-[100%]"
                  multiline
                  style={{ backgroundColor: theme.secondaryColor }}
                  value={exampleData[index]?.phonetic}
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[index] === undefined) {
                        return [
                          ...prev,
                          { phonetic: text, translation: "", sentence: "" },
                        ];
                      }
                      return [
                        ...prev.map((item, i) => {
                          if (i === index) {
                            return { ...item, phonetic: text };
                          }

                          return item;
                        }),
                      ];
                    });
                  }}
                ></TextInput>
                {error && (
                  <View className="gap-1 flex-row items-center">
                    <AntDesign
                      name="exclamationcircle"
                      size={12}
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
                  className="px-4 rounded-lg py-4 w-[100%]"
                  style={{ backgroundColor: theme.secondaryColor }}
                  value={exampleData[index]?.translation}
                  onChangeText={(text) => {
                    setExampleData((prev) => {
                      if (prev[index] === undefined) {
                        return [
                          ...prev,
                          { translation: text, phonetic: "", sentence: "" },
                        ];
                      }
                      return [
                        ...prev.map((item, i) => {
                          if (i === index) {
                            return { ...item, translation: text };
                          }

                          return item;
                        }),
                      ];
                    });
                  }}
                ></TextInput>
                {error && (
                  <View className="gap-1 flex-row items-center">
                    <AntDesign
                      name="exclamationcircle"
                      size={12}
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
