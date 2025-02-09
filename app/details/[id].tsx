import React, { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/Theme";
import data from "@/constants/dummy.json";
import LanguageDetails from "@/components/LanguageDetails";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomModal from "@/components/CustomModal";
type keyValuePair = {
  [key: string]: string;
};
type modalInput = {
  label: string;
  inputText: string | any;
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<modalInput[]>([]);
  const router = useRouter();
  type language = "japanese" | "chinese" | "korean";
  const languageOrder: language[] = ["japanese", "chinese", "korean"];
  const [langIdx, setLangIdx] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<language>(
    languageOrder[langIdx]
  );

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

  const showModal = ([...args]: keyValuePair[]) => {
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
    return (
      <View>
        <LanguageDetails
          word={data[0].japanese.kanji}
          type={data[0].type}
          level={data[0].japanese.level}
          reading={data[0].japanese.hiragana}
          formality={data[0].japanese.formality}
          romaji={data[0].japanese.romaji}
          handleSelectedLanguage={handleSelectedLanguage}
          selectedLanguage={selectedLanguage}
          handleEdit={showModal}
        />
        <View className="mt-6 gap-4">
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].burmese.translation}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    Burmese: data[0].burmese.translation,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2  text-neutral-500 text-sm">English</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].definition}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    English: data[0].definition,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
          <Text className="underline text-sm text-neutral-500">Examples</Text>
          <View className="gap-4">
            {data.map((word, i) => (
              <View className="flex-row gap-2">
                <Text>{i + 1}.</Text>
                <View>
                  <Text>
                    {getStyledSentences(word.japanese.examples[0].sentence)}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].japanese.examples[0].romaji}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].japanese.examples[0].translation}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };
  const ChineseComponent = () => {
    return (
      <View>
        <LanguageDetails
          word={data[0].chinese.hanzi}
          type={data[0].type}
          level={data[0].chinese.level}
          reading={data[0].chinese.pinyin}
          formality={data[0].chinese.formality}
          handleSelectedLanguage={handleSelectedLanguage}
          selectedLanguage={selectedLanguage}
          handleEdit={showModal}
        />
        <View className="mt-6 gap-4">
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].burmese.translation}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    Burmese: data[0].burmese.translation,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2  text-neutral-500 text-sm">English</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].definition}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    English: data[0].definition,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
          <Text className="underline text-sm text-neutral-500">Examples</Text>
          <View className="gap-4">
            {data.map((word, i) => (
              <View key={i} className="flex-row gap-2 items-start ">
                <Text className=" text-lg">{i + 1}.</Text>
                <View>
                  <Text>
                    {getStyledSentences(word.chinese.examples[i].sentence)}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].chinese.examples[i].pinyin}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].chinese.examples[i].translation}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const KoreanComponent = () => {
    return (
      <View>
        <LanguageDetails
          word={data[0].korean.hangul}
          type={data[0].type}
          level={data[0].korean.proficiency_level}
          reading={data[0].korean.romaji}
          formality={data[0].korean.formality}
          handleSelectedLanguage={handleSelectedLanguage}
          selectedLanguage={selectedLanguage}
          handleEdit={showModal}
        />
        <View className="mt-6 gap-4">
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2 text-neutral-500  text-sm">Burmese</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].burmese.translation}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    Burmese: data[0].burmese.translation,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
          <View className=" border-t-hairline border-t-neutral-400 pb-4">
            <Text className="mb-2  text-neutral-500 text-sm">English</Text>
            <View className="flex flex-row justify-between items-center">
              <Text>{data[0].definition}</Text>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                style={{
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => {
                  const obj: keyValuePair = {
                    English: data[0].definition,
                  };
                  showModal([obj]);
                }}
              >
                <MaterialCommunityIcons
                  name="book-edit-outline"
                  size={20}
                  color={theme.accentColor}
                />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View className="gap-4 my-4 border-t-hairline border-t-neutral-400">
          <Text className="underline text-sm text-neutral-500">Examples</Text>
          <View className="gap-4">
            {data.map((word, i) => (
              <View className="flex-row gap-2">
                <Text>{i + 1}.</Text>
                <View>
                  <Text>
                    {getStyledSentences(word.korean.examples[i].sentence)}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].korean.examples[i].romaji}
                  </Text>
                  <Text style={{ color: theme.mutedColor }}>
                    {data[0].korean.examples[i].translation}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const componentMapper: Record<language, JSX.Element> = {
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
        />
      </View>
    </SafeAreaView>
  );
}
