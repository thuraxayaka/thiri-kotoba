import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/hooks/Theme";
import { Language } from "@/types";

type option<T> = {
  label: string;
  value: T;
};
type Props<T> = {
  options: option<T>[];
  selectedOption: T;
  onSelect: React.Dispatch<React.SetStateAction<T>>;
};
function RadioButton<T extends React.ReactNode>({
  options,
  selectedOption,
  onSelect,
}: Props<T>) {
  const theme = useTheme();

  return (
    <View className="gap-4">
      {options.map((option, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => onSelect(option.value)}>
            <View className="flex-row items-center gap-2">
              <View
                className={`w-4 h-4 border-4 rounded-full p-1 ${
                  option.value === selectedOption ? "bg-pink-600" : "bg-white"
                }`}
                style={[{ borderColor: theme.faintedColor }]}
              ></View>
              <Text>{option.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default RadioButton;
