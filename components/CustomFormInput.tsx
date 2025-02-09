import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useRef } from "react";
import { useTheme } from "@/hooks/Theme";
type inputData = {
  label: string;
  inputText: string;
};
type Props = {
  index: number;
  label: string;
  value: string;
  handleChange: (value: inputData, index: number) => void;
};
const CustomFormInput = ({ label, value, index, handleChange }: Props) => {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);

  return (
    <View>
      <Text
        className="mb-4 border-b-hairline pb-1 "
        style={{
          color: theme.mutedColor,
          borderColor: theme.mutedColor,
        }}
      >
        {label}
      </Text>
      <TextInput
        ref={inputRef}
        value={value}
        className="rounded-md px-4 py-5 shadow-xl shadow-neutral-50"
        style={{ backgroundColor: theme.secondaryColor }}
        editable
        onChangeText={(text) => {
          handleChange({ label, inputText: text }, index);
        }}
        onFocus={() => {
          inputRef.current?.setSelection(0, value.length);
        }}
      />
    </View>
  );
};

export default CustomFormInput;

const styles = StyleSheet.create({});
