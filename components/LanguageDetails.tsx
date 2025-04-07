import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { useTheme } from "@/hooks/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useSpeech from "@/hooks/Speech";
import { Map } from "@/types";

interface Props {
  word: string;
  type: string;
  level: string;
  reading: string;
  romaji?: string;
  formality: string;
  handleSelectedLanguage: (idx: number) => void;
  selectedLanguage: string;
  handleEdit: ([...args]: Map<string>[]) => void;
}

const WordDetails = ({
  word,
  type,
  level,
  reading,
  romaji,
  formality,
  selectedLanguage,
  handleEdit,
  handleSelectedLanguage,
}: Props) => {
  const theme = useTheme();
  const { speak } = useSpeech();

  const partsOFSpeech: Map<string> = {
    noun: "(n)",
    adjective: "(adj)",
    adverb: "(adv)",
    verb: "(v)",
    interjection: "(intj)",
    conjunction: "(conj)",
    preposition: "(prep)",
  };

  const handleSpeech = () => {
    speak(selectedLanguage, word);
  };
  const indexMapper: Record<string, number> = {
    japanese: 0,
    chinese: 1,
    korean: 2,
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]}>
      <View>
        <View className="gap-2">
          <View className="flex-row justify-between  flex items-center">
            <View className="flex justify-start items-end flex-row gap-2">
              <Text
                className="text-2xl font-semibold"
                style={{ color: theme.textColor }}
              >
                {word}
              </Text>
              <View className="flex-row gap-2 items-end">
                <Text style={{ color: theme.mutedColor }}>
                  {partsOFSpeech[type]}
                </Text>
              </View>
            </View>
            <View className="flex-row  items-center">
              <TouchableHighlight
                onPress={handleSpeech}
                underlayColor={theme.faintedColor}
                style={{ borderRadius: 10, padding: 8 }}
              >
                <AntDesign
                  name="sound"
                  className="self-start"
                  size={28}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() =>
                  handleSelectedLanguage(indexMapper[selectedLanguage])
                }
                underlayColor={theme.faintedColor}
                style={{ borderRadius: 10, padding: 8 }}
              >
                <MaterialCommunityIcons
                  name="translate"
                  size={28}
                  color={theme.textColor}
                />
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  const arr: Map<string>[] = [];
                  arr.push({ word });
                  arr.push({ phonetic: reading });
                  if (romaji) arr.push({ romaji });
                  handleEdit([...arr]);
                }}
                underlayColor={theme.faintedColor}
                style={{ borderRadius: 10, padding: 8 }}
              >
                <FontAwesome
                  name="pencil-square-o"
                  size={28}
                  color={theme.textColor}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <View>
              <Text style={{ color: theme.mutedColor,fontWeight: 'bold' }}>{reading}</Text>
              <Text style={{ color: theme.mutedColor }}>{romaji}</Text>
            </View>
            <View className="flex-row gap-1">
              {formality === "neutral" && (
                <Text className="rounded-md bg-rose-200 px-1 text-xs">
                  {formality}
                </Text>
              )}
              <Text className="rounded-md bg-rose-200 px-1 text-xs">
                {level}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WordDetails;
