import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
const Category = () => {
  const { category } = useLocalSearchParams();
  console.log(category);
  return (
    <View>
      <Text className="text-[1.8em]">Category: {category}</Text>
    </View>
  );
};

export default Category;
