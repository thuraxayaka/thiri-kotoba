import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/Theme";
import { useMemo } from "react";

type props = {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  onPress: any;
};

const ListItem = ({ id, word, phonetic, translation, onPress }: props) => {
  const theme = useTheme();

  const handlePress = (id: number) => {
    onPress(id);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TouchableHighlight
          underlayColor={theme.secondaryColor}
          onPress={() => handlePress(id)}
        >
          <View className="flex justify-center gap-2 mt-2  items-start">
            <View className="flex flex-row  gap-2 items-start">
              <Text>{word}</Text>
              <Text>({phonetic})</Text>
            </View>
            <View className="mb-2">
              <Text>{translation}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ListItem;
