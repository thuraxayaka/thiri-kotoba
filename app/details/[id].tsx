import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/Theme";
import LanguageDetails from "@/components/LanguageDetails";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useFocusEffect } from "expo-router";
import { useSqlite } from "@/hooks/Database";
import { useSQLiteContext } from "expo-sqlite";
import Feather from "@expo/vector-icons/Feather";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { changeTheme } from "@/stores/settingSlice";
import { WordDetails, Language, Map, Example, Word } from "@/types";
import { ScrollView } from "react-native";

type ProcessedDataType = {
  id: string | number | undefined;
  word: string;
};
export default function DetailsScreen() {
  const { id, language } = useLocalSearchParams();
  const lang: Language = language as Language;
  const [favorite, setFavorite] = useState<boolean>(false);
  const router = useRouter();
  const [wordDetails, setWordDetails] = useState<Partial<WordDetails>>({});
  const [synonyms, setSynonyms] = useState<ProcessedDataType[]>([]);
  const [antonyms, setAntonyms] = useState<ProcessedDataType[]>([]);
  const db = useSQLiteContext();
  const theme = useTheme();

  useEffect(() => {
    async function getData() {
      try {
        if (lang === "japanese") {
          const result = await db.getFirstAsync(
            `SELECT id,word,parts_of_speech,categories,english,burmese,definition,level,formality,
             pronunciation,'japanese' as language,romaji,synonyms,antonyms,frequency,favorite FROM japanese_word WHERE id = ${id};`
          );
          if (!result) throw `word_id [${id}] doesn't exist`;
          const word = result as Word;

          const examples: Example[] = await db.getAllAsync(
            `SELECT * FROM japanese_example WHERE word_id = ${id}`
          );

          if (typeof word.categories === "string") {
            word.categories = word.categories.split(",");
          }
          if (typeof word.synonyms === "string") {
            word.synonyms = word.synonyms.split(",");
          }
          if (typeof word.antonyms === "string") {
            word.antonyms = word.antonyms.split(",");
          }

          setWordDetails({ word, examples });
        } else if (lang === "chinese") {
          const result = await db.getFirstAsync(
            `SELECT id,word,parts_of_speech,categories,english,burmese,definition,level,formality,
            pinyin as pronunciation,synonyms,antonyms,frequency,favorite,'chinese' as language FROM chinese_word WHERE id = ${id};`
          );
          if (!result) throw `word_id [${id}] doesn't exist`;
          const word = result as Word;
          const examples: Example[] = await db.getAllAsync(
            `SELECT * FROM chinese_example WHERE word_id = ${id}`
          );
          if (typeof word.categories === "string") {
            word.categories = word.categories.split(",");
          }
          if (typeof word.synonyms === "string") {
            word.synonyms = word.synonyms.split(",");
          }
          if (typeof word.antonyms === "string") {
            word.antonyms = word.antonyms.split(",");
          }

          setWordDetails({ word, examples });
        } else {
          const result = await db.getFirstAsync(
            `SELECT id,word,parts_of_speech,categories,english,burmese,definition,level,formality,
             romaji as pronunciation,synonyms,antonyms,frequency,favorite,'korean' as language FROM korean_word WHERE id = ${id};`
          );
          if (!result) throw `word_id [${id}] doesn't exist`;
          const word = result as Word;
          const examples: Example[] = await db.getAllAsync(
            `SELECT * FROM korean_example WHERE word_id = ${id}`
          );
          if (typeof word.categories === "string") {
            word.categories = word.categories.split(",");
          }
          if (typeof word.synonyms === "string") {
            word.synonyms = word.synonyms.split(",");
          }
          if (typeof word.antonyms === "string") {
            word.antonyms = word.antonyms.split(",");
          }

          setWordDetails({ word, examples });
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function runAction() {
      await getData();
    }
    runAction();
  }, []);

  useEffect(() => {
    async function findWord() {
      if (Array.isArray(wordDetails.word?.synonyms)) {
        wordDetails.word?.synonyms?.forEach(async (synonym) => {
          const index = synonyms.findIndex((item) => item.word === synonym);
          if (index !== -1) return;
          const result = await getWordId(synonym);
          setSynonyms((prev) => {
            return [...prev, { id: result?.id, word: synonym }];
          });
        });
      }
      if (Array.isArray(wordDetails.word?.antonyms)) {
        wordDetails.word?.antonyms?.forEach(async (antonym) => {
          const index = antonyms.findIndex((item) => item.word === antonym);
          if (index !== -1) return;
          const result = await getWordId(antonym);
          setAntonyms((prev) => [...prev, { id: result?.id, word: antonym }]);
        });
      }
    }

    findWord();
  }, [wordDetails]);

  useEffect(() => {
    console.log("antonyms:");
    console.log(antonyms);
    console.log("synonyms:");
    console.log(synonyms);
  }, [synonyms, antonyms]);
  const getWordId = async (
    value: string
  ): Promise<{ id: string | number } | null> => {
    try {
      const query = `SELECT * FROM ${lang}_word WHERE word=$word;`;
      const statement = await db.prepareAsync(query);

      const execResult = await statement.executeAsync({
        $word: value,
      });
      const result = await execResult.getFirstAsync();
      if (result) {
        const word = result as any;
        return { id: word.id };
      }
    } catch (err) {
      return null;
    }

    return null;
  };

  const getStyledSentences = (input: string): JSX.Element => {
    const formattedString = input.split(/(\(.*?\))/g).map((part, index) => {
      if (part.match(/^\(.*?\)$/)) {
        return (
          <Text key={index} style={{ color: theme.mutedColor }}>
            {part}
          </Text>
        );
      }
      return (
        <Text key={index} className="text-md">
          {part}
        </Text>
      );
    });

    return <Text>{formattedString}</Text>;
  };

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.primaryColor,
      },
    });
  }, [theme]);
  const goBack = () => {
    router.back();
  };

  const goTo = (id: string | number) => {
    router.push(`/details/${id}?language=${encodeURIComponent(lang)}`);
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <ScrollView className="gap-4 px-4">
        <View className="flex-row mb-4 justify-between items-center">
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color="black"
            onPress={goBack}
          />
        </View>

        <View>
          {
            <View>
              {wordDetails.word?.language === "japanese" && (
                <LanguageDetails
                  word={wordDetails.word.word}
                  partsOfSpeech={wordDetails.word.parts_of_speech}
                  level={wordDetails.word.level}
                  reading={wordDetails.word.pronunciation}
                  formality={wordDetails.word.formality}
                  romaji={wordDetails.word.romaji}
                  selectedLanguage={lang}
                  categories={wordDetails.word.categories}
                />
              )}
              {(wordDetails.word?.language === "korean" ||
                wordDetails.word?.language === "chinese") && (
                <LanguageDetails
                  word={wordDetails.word.word}
                  partsOfSpeech={wordDetails.word.parts_of_speech}
                  level={wordDetails.word.level}
                  reading={wordDetails.word.pronunciation}
                  formality={wordDetails.word.formality}
                  selectedLanguage={lang}
                  categories={wordDetails.word.categories}
                />
              )}
              <View className="mt-6 ">
                <View className=" border-t-hairline border-b-hairline py-4 border-stone-400 ">
                  <Text className="mb-1 text-neutral-500 text-sm">Burmese</Text>
                  <Text className="text-md">{wordDetails.word?.burmese}</Text>
                </View>
                <View className="py-4">
                  <Text className="mb-1  text-neutral-500 text-sm">
                    English
                  </Text>
                  <Text className="text-md">{wordDetails.word?.english}</Text>
                </View>
                <View className="  border-t-hairline border-b-hairline py-4 border-stone-400">
                  <Text className="mb-1  text-neutral-500 text-sm">
                    Definition
                  </Text>
                  <Text className="text-md">
                    {wordDetails.word?.definition}
                  </Text>
                </View>
              </View>
              <View className="gap-4 py-4 border-b-hairline  border-b-stone-400">
                <Text className="text-sm text-neutral-500">Examples</Text>
                <View className="gap-2">
                  {wordDetails.examples?.map((example, i) => (
                    <View key={i}>
                      <View className="flex justify-center py-2">
                        <Text className="font-semibold">
                          {getStyledSentences(example.sentence)}
                        </Text>
                        <Text style={{ color: theme.mutedColor }}>
                          {example.translation}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View className="py-4">
                <View className=" flex-row gap-1 mb-2">
                  <Text>Synonyms:</Text>

                  {synonyms.map((value, i) => {
                    if (value.id === undefined) {
                      return (
                        <View className="flex-row items-center flex-wrap">
                          <Text key={i} style={{ color: theme.mutedColor }}>
                            {value.word}
                          </Text>
                          {i + 1 !== synonyms.length && <Text>,</Text>}
                        </View>
                      );
                    }

                    return (
                      <View className="flex-row items-center flex-wrap">
                        <TouchableOpacity
                          onPress={() => {
                            if (value.id) goTo(value.id);
                          }}
                        >
                          <Text
                            className="border-b-hairline border-fuchsia-400"
                            style={{ color: theme.accentColor }}
                          >
                            {value.word}
                          </Text>
                        </TouchableOpacity>
                        {i + 1 !== synonyms.length && <Text>,</Text>}
                      </View>
                    );
                  })}
                </View>
                <View className=" flex-row gap-1">
                  <Text>Antonyms:</Text>
                  {antonyms.map((value, i) => {
                    if (value.id === undefined) {
                      return (
                        <View className="flex-row items-center flex-wrap">
                          <Text key={i} style={{ color: theme.mutedColor }}>
                            {value.word}
                          </Text>
                          {i + 1 !== antonyms.length && <Text>,</Text>}
                        </View>
                      );
                    }

                    return (
                      <View className="flex-row items-center flex-wrap">
                        <TouchableOpacity
                          onPress={() => {
                            if (value.id) goTo(value.id);
                          }}
                        >
                          <Text
                            className="border-b-hairline border-fuchsia-400"
                            style={{ color: theme.accentColor }}
                          >
                            {value.word}
                          </Text>
                        </TouchableOpacity>
                        {i + 1 !== antonyms.length && <Text>,</Text>}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
