import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { useDictionary, useInitializiedWords } from "@/hooks/Dictionary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetwork } from "@/hooks/Network";
import ListItem from "@/components/ListItem";
import { FlashList } from "@shopify/flash-list";
import { useAppSelector, useAppDispatch } from "@/hooks/Hook";
import { AppDispatch, RootState } from "@/stores/store";
import { useDownloadData } from "@/hooks/DownloadData";

import { useTheme } from "@/hooks/Theme";
import { StatusBar } from "expo-status-bar";

import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useSQLiteContext } from "expo-sqlite";
import { useSqlite } from "@/hooks/Database";
import * as SecureStore from "expo-secure-store";
import MultistepForm from "@/components/Form/MultiStepForm";
import { reset, setIsModalVisible } from "@/stores/formSlice";
import { useFonts } from "expo-font";
export default function Index() {
  const db = useSQLiteContext();
  const dispatch = useAppDispatch<AppDispatch>();

  const searchSel = useAppSelector<RootState>(
    (state) => state.search.searchWord
  );
  const isModalVisible = useAppSelector(
    (state: RootState) => state.form.isModalVisible
  );

  const searchWord = searchSel as string;

  const { setup, clearAll, getAllTables, loading } = useSqlite();

  const router = useRouter();
  const theme = useTheme();

  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    async function populate() {
      const isPopulated = await SecureStore.getItemAsync("populated");
      if (isPopulated) {
        console.log("already populated.Skipping....");
        return;
      }

      const { completedCount, totalCount, loading } = await setup();
      console.log("loading..." + loading);

      console.log(`imported ${completedCount}/${totalCount}`);
    }
    async function run() {
      await clearAll();
      await populate();
      SecureStore.setItem("populated", "true");
    }
    run();
  }, []);
  const closeModal = () => {
    dispatch(setIsModalVisible(false));
    dispatch(reset());
  };
  const detectWord = (text: string): string => {
    if (text === "") return "";
    const romaji = /[a-zA-Z]/g.test(text);
    if (romaji) return "romaji";
    const isBurmese = /[\u1000-\u109F]/g.test(text);
    if (isBurmese) return "burmese";
    const isJapanese = /[\u3040-\u309F\u30A0-\u30FF]/g.test(text);
    if (isJapanese) return "hiragana/katakana";
    const isKorean = /[\uAC00-\uD7AF\u1100-\u11FF]/g.test(text);
    if (isKorean) return "hangul";
    return "kanji";
  };

  useEffect(() => {
    async function getSearchData(word: string) {
      if (word === "") {
        setData([]);
        return;
      }
      if (word === "romaji") {
        try {
          const japaneseResult = await db.getAllAsync(
            `SELECT id,word,pronunciation,burmese,favorite,'japanese' as language FROM japanese_word WHERE romaji LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          const chineseResult = await db.getAllAsync(
            `SELECT id,word,pinyin as pronunciation,burmese,favorite,'chinese' as language FROM chinese_word WHERE  pinyin LIKE $search OR pinyin_simplified LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          const koreanResult = await db.getAllAsync(
            `SELECT id,word,romaji as pronunciation,burmese,favorite,'korean' as language FROM korean_word WHERE romaji LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          setData([...japaneseResult, ...chineseResult, ...koreanResult]);
        } catch (error) {
          console.log("error in index.tsx .Caused by :" + error);
        }
      } else if (word === "burmese") {
        try {
          const japaneseResult = await db.getAllAsync(
            `SELECT id,word,pronunciation,burmese,favorite,'japanese' as language FROM japanese_word WHERE burmese LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          const chineseResult = await db.getAllAsync(
            `SELECT id,word,pinyin as pronunciation,burmese,favorite,'chinese' as language FROM chinese_word WHERE  burmese LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          const koreanResult = await db.getAllAsync(
            `SELECT id,word,romaji as pronunciation,burmese,favorite,'korean' as language FROM korean_word WHERE burmese LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          setData([...japaneseResult, ...chineseResult, ...koreanResult]);
        } catch (err) {
          console.log(err);
        }
      } else if (word === "hiragana/katakana") {
        try {
          const japaneseResult = await db.getAllAsync(
            `SELECT id,word,pronunciation,burmese,favorite,'japanese' as language FROM japanese_word WHERE pronunciation LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          setData([...japaneseResult]);
        } catch (error) {
          console.log("error in index.tsx. Caused by " + error);
        }
      } else if (word === "hangul") {
        try {
          const koreanResult = await db.getAllAsync(
            `SELECT id,word,romaji as pronunciation,burmese,favorite,'korean' as language FROM korean_word WHERE word LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          setData([...koreanResult]);
        } catch (error) {
          console.log("error in index.tsx.Caused by " + error);
        }
      } else if (word === "kanji") {
        try {
          const japaneseResult = await db.getAllAsync(
            `SELECT id,word,pronunciation,burmese,favorite,'japanese' as language FROM japanese_word WHERE word LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          const chineseResult = await db.getAllAsync(
            `SELECT id,word,pinyin as pronunciation,burmese,favorite,'chinese' as language FROM chinese_word WHERE word LIKE $search;`,
            { $search: `${searchWord}%` }
          );
          setData([...japaneseResult, ...chineseResult]);
        } catch (error) {
          console.log("error in index.tsx.Caused by " + error);
        }
      }
    }

    async function run() {
      await getSearchData(detectWord(searchWord));
    }
    run();
  }, [searchWord]);

  const goToDetails = (id: number, language: string) => {
    router.push(`/details/${id}?language=${encodeURIComponent(language)}`);
  };
  const sync = () => {};
  const showHistory = () => {};
  const preloadVoices = () => {
    const languages = ["zh-CN", "ja-JP", "ko-KR"];
    languages.forEach((language) => {
      Speech.speak(" ", { language, pitch: 1.0 });
    });
  };
  useEffect(() => {
    preloadVoices();
  }, []);
  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      className="flex-1"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <StatusBar backgroundColor={theme.primaryColor} />

      <View className="mx-2 flex-1">
        <FlashList
          estimatedItemSize={50}
          data={data}
          ItemSeparatorComponent={() => (
            <View className="w-full border-stone-400 border-t-hairline"></View>
          )}
          renderItem={({ item: item }) => (
            <ListItem
              id={item.id}
              word={item.word}
              pronunciation={item.pronunciation}
              translation={item.burmese}
              language={item.language}
              onPress={goToDetails}
              isFavorite={item.favorite}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <MultistepForm
        isTransparent={true}
        isVisible={isModalVisible}
        animationType="slide"
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}
