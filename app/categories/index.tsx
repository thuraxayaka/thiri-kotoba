import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/hooks/Theme";

const Categories = () => {
  const theme = useTheme();
  return (
    <View
      className="min-h-[100vh] mx-auto w-[95%]"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <Text className="text-[1.5rem]">Categories</Text>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({});
