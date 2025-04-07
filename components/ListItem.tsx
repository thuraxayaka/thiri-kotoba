import React from "react";
import { Text, View, TouchableHighlight, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { Map } from "@/types";
type props = {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  onPress: any;
  language: string;
  isFavorite: number;
};

const ListItem = ({
  id,
  word,
  phonetic,
  translation,
  onPress,
  language,
  isFavorite,
}: props) => {
  const [favorite, setFavorite] = React.useState<number>(isFavorite);
  const theme = useTheme();
  const db = useSQLiteContext();

  const handlePress = () => {
    onPress(id, language);
  };

  const handleFavorite = async () => {
    try {
      await db.runAsync(
        "UPDATE word SET isFavorite = $favorite WHERE id = $id ",
        { $favorite: favorite === 0 ? 1 : 0, $id: id }
      );
      setFavorite((prev) => {
        return prev === 0 ? 1 : 0;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const languageText:Map<string> = {
    "japanese": "JP",
    "chinese" : "CN",
    "korean" : "KR"
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TouchableHighlight
          underlayColor={theme.secondaryColor}
          style={{ backgroundColor: theme.primaryColor }}
          onPress={handlePress}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex justify-center gap-2 mt-2  items-start">
              <View className="flex flex-row  gap-2 items-center">
                
                <Text className="font-bold">[{languageText[language]}]</Text>
                <View className='flex-row items-center'>
                <Text>{word}</Text>
                <Text className="text-sm" style={{color: theme.mutedColor}}>({phonetic})</Text>

                </View>
              </View>
              <View className="mb-2">
                <Text>{translation}</Text>
              </View>
            </View>
            <View>
              <TouchableHighlight
                underlayColor={theme.faintedColor}
                onPress={handleFavorite}
                className="rounded-full p-2"
              >
                <Ionicons
                  name={favorite ? "heart" : "heart-outline"}
                  size={24}
                  color={favorite ? theme.accentColor : theme.faintedColor}
                />
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ListItem;
