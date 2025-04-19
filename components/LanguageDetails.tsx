import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@/hooks/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import useSpeech from "@/hooks/Speech";
import { Map } from "@/types";
import { useRouter } from "expo-router";
interface Props {
  word: string;
  partsOfSpeech: string;
  level: string;
  reading: string;
  romaji?: string;
  formality: string;
  categories: string[] | string;
  selectedLanguage: string;
}

const WordDetails = ({
  word,
  partsOfSpeech,
  level,
  reading,
  romaji,
  formality,
  categories,
  selectedLanguage,
}: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const { speak } = useSpeech();

  const partsOfSpeechType: Map<string> = {
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
  const [tags, setTags] = React.useState<string[]>([]);
  useEffect(() => {
    if (Array.isArray(categories)) setTags(categories);
  }, []);

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
                  {partsOfSpeechType[partsOfSpeech]}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableHighlight
                onPress={handleSpeech}
                underlayColor={theme.faintedColor}
                style={{ borderRadius: 10, padding: 8 }}
              >
                <Feather name="volume-2" size={24} color="black" />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {}}
              >
                <Feather name="edit" size={20} color="black" />
              </TouchableHighlight>
            </View>
          </View>
          <View className="flex-row items-center justify-between gap-4">
            <View>
              <Text style={{ color: theme.mutedColor, fontWeight: "bold" }}>
                {reading}
              </Text>
              {romaji && (
                <Text style={{ color: theme.mutedColor }}>{romaji}</Text>
              )}
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
          <View className="flex-row items-center gap-2 mt-4">
            <Text className="flex items-center">Tags:</Text>
            {tags.map((tag, i) => {
              return (
                <View className="flex-row items-center" key={i}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/categories");
                    }}
                  >
                    <Text
                      className="border-b-hairline border-fuchsia-400"
                      style={{ color: theme.accentColor }}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                  {i !== tags.length - 1 && <Text>,</Text>}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WordDetails;
