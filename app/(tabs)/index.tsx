import React, { useEffect, useMemo, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { useDictionary, useInitializiedWords } from "@/hooks/Dictionary";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetwork } from "@/hooks/Network";
import ListItem from "@/components/ListItem";
import { useInitialized } from "@/hooks/Setup";
import { Link, useNavigation } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks/Hook";
import { AppDispatch, RootState } from "@/stores/store";
import { useDownloadData } from "@/hooks/DownloadData";
import { setWords } from "@/stores/wordSlice";
import { useTheme } from "@/hooks/Theme";
import { StatusBar } from "expo-status-bar";
import SearchBox from "@/components/SearchBox";
import dummyData from "@/constants/dummy.json";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const [searchWord, setSearchWord] = useState<string | undefined>(undefined);
  console.log(searchWord);
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.primaryColor,
        color: theme.secondaryColor,
      },
      statusBar: {
        margin: 0,
      },

      card: {
        width: 400,
        height: 600,
        backgroundColor: theme.accentColor,
        color: theme.textColor,
      },
    });
  }, [theme]);
  const goToDetails = (id: number) => {
    router.push(`/details/${id}`);
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
      style={[styles.container]}
      edges={["left", "bottom", "right"]}
    >
      <StatusBar backgroundColor={theme.primaryColor} />
      <View>
        <SearchBox
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          sync={sync}
          showHistory={showHistory}
        />
      </View>
      <View className="mx-2">
        <FlatList
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: theme.secondaryColor,
                }}
              ></View>
            );
          }}
          data={dummyData}
          renderItem={({ item: item }) => (
            <ListItem
              id={item.id}
              word={item.japanese.kanji}
              phonetic={item.japanese.romaji}
              translation={item.burmese.translation}
              onPress={goToDetails}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
