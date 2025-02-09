import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/Theme";
type Props = {
  title: string;
  bg: string;
  onPress: () => void;
  color: string;
};
const Button = ({ title, bg, color, onPress }: Props) => {
  const theme = useTheme();
  return (
    <TouchableHighlight
      onPress={onPress}
      className="rounded-[10]"
      underlayColor={color}
    >
      <View
        style={{
          backgroundColor: bg,
        }}
        className="px-5 py-2 rounded-lg flex justify-center items-center"
      >
        <Text
          className="text-lg"
          style={{
            color: color,
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default Button;

const styles = StyleSheet.create({});
