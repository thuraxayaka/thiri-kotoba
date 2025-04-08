import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, FlatList, StyleSheet, Image } from "react-native";
import { useDictionary, useInitializiedWords } from "@/hooks/Dictionary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetwork } from "@/hooks/Network";
import ListItem from "@/components/ListItem";
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

export default function Index() {
  const db = useSQLiteContext();
  const dispatch = useAppDispatch<AppDispatch>();
  const tabBarHeight = useAppSelector<RootState>((state) => {
    state.setting.tabBarHeight;
  });
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
  // useFocusEffect(
  //   useCallback(() => {
  //     async function update() {
  //       await getSearchData(detectLanguage(searchWord));
  //     }
  //     update();
  //   }, [])
  // );
  useEffect(() => {
    async function populate() {
  
      const isPopulated = await SecureStore.getItemAsync("populated");
      if (isPopulated) {
        console.log("already populated.Skipping....");
        return;
      }

      const { completedCount, totalCount } = await setup();

      console.log(`importing ${completedCount}/${totalCount}`);
    }
    async function run() {
      // await clearAll();
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
    return "kenji";
  };
  useEffect(() => {
    async function getSearchData(word: string) {
      console.log(word);
      if (word === "") {
        setData([]);
        return;
      }
      if (word === "romaji") {
        try {
          const japaneseRes = await db.getAllAsync(
            "SELECT 'japanese' as language,word.id,japanese.kanji AS word,japanese.hiragana AS phonetic,word.translation,word.isFavorite,japanese.romaji from word JOIN japanese ON japanese.word_id = word.id WHERE romaji LIKE $search",
            // "SELECT * FROM japanese",
            { $search: `${searchWord}%` }
          );
          const chineseRes = await db.getAllAsync(
            "SELECT 'chinese' as language,word.id,chinese.pinyin AS phonetic,chinese.hanzi AS word,word.translation,word.isFavorite from word JOIN chinese ON chinese.word_id = word.id WHERE pinyin LIKE $search OR pinyin_simplified LIKE $search",
            { $search: `${searchWord}%` }
          );
          const koreanRes = await db.getAllAsync(
            "SELECT 'korean' as language,word.id,korean.hangul AS word,korean.romaji AS phonetic,translation,word.isFavorite from word JOIN korean ON korean.word_id = word.id WHERE romaji LIKE $search;",
            { $search: `${searchWord}%` }
          );
         
          setData([...japaneseRes, ...chineseRes, ...koreanRes]);
        } catch (error) {
          console.log("error in index.tsx.Caused by " + error);
        }
      } else if (word === "burmese") {
        try {
          const japaneseRes = await db.getAllAsync(
            "SELECT 'japanese' as language,word.id,japanese.kanji AS word,japanese.hiragana AS phonetic,word.translation,word.isFavorite from word JOIN japanese ON japanese.word_id = word.id WHERE translation LIKE $search;",
            { $search: `${searchWord}%` }
          );
          setData([...japaneseRes]);
        } catch (err) {
          console.log(err);
        }
      } else if (word === "hiragana/katakana") {
        try {
          const jpResult = await db.getAllAsync(
            "SELECT 'japanese' as language,word.id,japanese.kanji AS word,japanese.hiragana AS phonetic,word.translation,isFavorite from word JOIN japanese ON japanese.word_id = word.id WHERE hiragana LIKE $search OR kanji LIKE $search;",
            { $search: `${searchWord}%` }
          );
          setData([...jpResult]);
        } catch (error) {
          console.log("error in index.tsx. Caused by " + error);
        }
      } else if (word === "hangul") {
        try {
          const result = await db.getAllAsync(
            "SELECT 'korean' as language,word.id,korean.hangul AS word,korean.romaji AS phonetic,translation,isFavorite from word JOIN korean ON korean.word_id = word.id WHERE hangul LIKE $search;",
            { $search: `${searchWord}%` }
          );
          setData([...result]);
        } catch (error) {
          console.log("error in index.tsx.Caused by " + error);
        }
      } else if(word === "kenji") {
        try {
          const jpResult = await db.getAllAsync(
            "SELECT 'japanese' as language,word.id,japanese.kanji AS word,japanese.hiragana AS phonetic,word.translation,isFavorite from word JOIN japanese ON japanese.word_id = word.id WHERE hiragana LIKE $search OR kanji LIKE $search;",
            { $search: `${searchWord}%` }
          );
          const cnResult = await db.getAllAsync(
            "SELECT 'chinese' as language,word.id,chinese.pinyin AS phonetic,chinese.hanzi AS word,word.translation,isFavorite from word JOIN chinese ON chinese.word_id = word.id WHERE hanzi LIKE $search",
            { $search: `${searchWord}%` }
          );

         
          setData([...jpResult,...cnResult]);

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
      <StatusBar
        backgroundColor={
          isModalVisible ? theme.faintedColor : theme.primaryColor
        }
      />

      <View className="mx-2  bg-amber-400">
        <FlatList
          style={{}}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: theme.secondaryColor,
                }}
              ></View>
            );
          }}
          data={data}
          renderItem={({ item: item }) => (
            <ListItem
              id={item.id}
              word={item.word}
              phonetic={item.phonetic}
              translation={item.translation}
              language={item.language}
              onPress={goToDetails}
              isFavorite={item.isFavorite}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
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
