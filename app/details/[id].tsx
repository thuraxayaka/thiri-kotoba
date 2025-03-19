import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/Theme";
import data from "@/constants/dummy.json";
import LanguageDetails from "@/components/LanguageDetails";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useFocusEffect } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomModal from "@/components/CustomModal";
import { useSqlite } from "@/hooks/Database";
import { useSQLiteContext } from "expo-sqlite";

import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { changeTheme } from "@/stores/settingSlice";
import { WordDetails, Language, Map } from "@/types";

type modalInput = {
  label: string;
  inputText: string | any;
};

export default function DetailsScreen() {
  const { id, language } = useLocalSearchParams();
  const lang: Language = language as Language;

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<modalInput[]>([]);
  const router = useRouter();
  const languageOrder: Language[] = ["japanese", "chinese", "korean"];

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(lang);

  const [wordData, setWordData] = useState<
    Partial<Record<Language, WordDetails>>
  >({});
  const db = useSQLiteContext();
  const theme = useTheme();

  useEffect(() => {
    async function getData() {
      if (wordData[selectedLanguage]) {
        return;
      }

      try {
        const word = await db.getFirstAsync(
          `SELECT * FROM ${selectedLanguage} JOIN word ON word.id = ${selectedLanguage}.word_id WHERE word.id = ${id} `
        );
        if (!word) throw `Word ${word} doesn't exist`;
        const examples = await db.getAllAsync(
          `SELECT * FROM ${selectedLanguage}_example WHERE word_id = ${id}`
        );

        if (examples.length == 0) throw `Examples for ${word} doesn't exist`;
        setWordData((prev) => {
          return {
            ...prev,
            [selectedLanguage]: {
              word: { ...word, language: selectedLanguage },
              examples,
            },
          };
        });
      } catch (err) {
        console.log(err);
      }
    }
    getData();
  }, [selectedLanguage]);

  const handleSelectedLanguage = (idx: number) => {
    if (idx < 2) {
      idx++;
    } else {
      idx = 0;
    }
    setSelectedLanguage(languageOrder[idx]);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const showModal = ([...args]: Map<string>[]) => {
    const arr: modalInput[] = [];
    args.forEach((arg) => {
      const key = Object.keys(arg)[0];
      const value = Object.values(arg)[0];
      const obj: modalInput = { label: key, inputText: value };
      arr.push(obj);
    });
    setModalData(arr);
    setModalVisible(true);
  };
  const getStyledSentences = (input: string): JSX.Element => {
    const formattedString = input.split(/(\(.*?\))/g).map((part, index) => {
      if (part.match(/^\(.*?\)$/)) {
        return (
          <Text key={index} style={{ color: theme.faintedColor }}>
            {part}
          </Text>
        );
      }
      return (
        <Text key={index} className="text-lg">
          {part}
        </Text>
      );
    });

    return <Text className="text-base">{formattedString}</Text>;
  };

  const JapaneseComponent = () => {
    const data = wordData["japanese"];
    const word = data && data.word;
    const examples = data && data.examples;
    return (
      <View>
        {word && examples && (
          <View>
            {word.language === "japanese" && (
              <LanguageDetails
                word={word.kanji}
                type={word.type}
                level={word.level}
                reading={word.hiragana}
                formality={word.formality}
                romaji={word.romaji}
                handleSelectedLanguage={handleSelectedLanguage}
                selectedLanguage={selectedLanguage}
                handleEdit={showModal}
              />
            )}
            <View className="mt-6 gap-4">
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.translation}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        Burmese: word.translation,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2  text-neutral-500 text-sm">English</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.definition}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        English: word.definition,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
              <Text className="underline text-sm text-neutral-500">
                Examples
              </Text>
              <View className="gap-4">
                {examples.map((example, i) => (
                  <View key={i} className="flex-row gap-2">
                    <Text>{i + 1}.</Text>
                    <View>
                      <Text>{getStyledSentences(example.sentence)}</Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.phonetic}
                      </Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.translation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };
  const ChineseComponent = () => {
    const data = wordData["chinese"];
    const word = data && data.word;
    const examples = data && data.examples;

    return (
      <View>
        {word && examples && (
          <View>
            {word.language === "chinese" && (
              <LanguageDetails
                word={word.hanzi}
                type={word.type}
                level={word.level}
                reading={word.pinyin}
                formality={word.formality}
                handleSelectedLanguage={handleSelectedLanguage}
                selectedLanguage={selectedLanguage}
                handleEdit={showModal}
              />
            )}
            <View className="mt-6 gap-4">
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.translation}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        Burmese: word.translation,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2  text-neutral-500 text-sm">English</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.definition}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        English: word.definition,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
              <Text className="underline text-sm text-neutral-500">
                Examples
              </Text>
              <View className="gap-4">
                {examples.map((example, i) => (
                  <View key={i} className="flex-row gap-2 items-start ">
                    <Text className=" text-lg">{i + 1}.</Text>
                    <View>
                      <Text>{getStyledSentences(example.sentence)}</Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.phonetic}
                      </Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.translation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const KoreanComponent = () => {
    const data = wordData.korean;
    const word = data?.word;
    const examples = data?.examples;
    return (
      <View>
        {word && examples && (
          <View>
            {word.language === "korean" && (
              <LanguageDetails
                word={word.hangul}
                type={word.type}
                level={word.level}
                reading={word.romaji}
                formality={word.formality}
                handleSelectedLanguage={handleSelectedLanguage}
                selectedLanguage={selectedLanguage}
                handleEdit={showModal}
              />
            )}
            <View className="mt-6 gap-4">
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.translation}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        Burmese: word.translation,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
              <View className=" border-t-hairline border-t-neutral-400 pb-4">
                <Text className="mb-2  text-neutral-500 text-sm">English</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{word.definition}</Text>
                  <TouchableHighlight
                    underlayColor={theme.faintedColor}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      const obj: Map<string> = {
                        English: word.definition,
                      };
                      showModal([obj]);
                    }}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={20}
                      color={theme.textColor}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
              <Text className="underline text-sm text-neutral-500">
                Examples
              </Text>
              <View className="gap-4">
                {examples.map((example, i) => (
                  <View key={i} className="flex-row gap-2 items-start ">
                    <Text className=" text-lg">{i + 1}.</Text>
                    <View>
                      <Text>{getStyledSentences(example.sentence)}</Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.phonetic}
                      </Text>
                      <Text style={{ color: theme.mutedColor }}>
                        {example.translation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const componentMapper: Record<Language, JSX.Element> = {
    japanese: <JapaneseComponent />,
    chinese: <ChineseComponent />,
    korean: <KoreanComponent />,
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
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <View className="gap-4 px-4">
        <Ionicons
          name="arrow-back-outline"
          className="mt-4"
          size={28}
          color="black"
          onPress={goBack}
        />

        {componentMapper[selectedLanguage]}
        <CustomModal
          isVisible={isModalVisible}
          transparent={true}
          animationType="fade"
          closeModal={handleClose}
          data={modalData}
          wordId={id as string}
          language={selectedLanguage}
          setWordData={setWordData}
        />
      </View>
    </SafeAreaView>
  );
}
