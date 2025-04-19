import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useTheme } from "@/hooks/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
const DrawerContents = () => {
  const theme = useTheme();
  return (
    <View
      className="justify-between flex-1"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <View>
        <View className="flex-row justify-between items-center my-4 mx-2">
          <Text className="text-2xl">Thiri's Kotoba</Text>
        </View>
        <Separator />
        <Link href="/">
          <View className="flex-row items-center gap-2  px-4 py-4">
            <Feather name="activity" size={20} color="black" />
            <Text>Recent</Text>
          </View>
        </Link>
        <Separator />
        <Link href="/">
          <View className="flex-row items-center gap-2  px-4 py-4">
            <Feather name="star" size={20} color="black" />
            <Text>Favorite </Text>
          </View>
        </Link>
        <Separator />
        <Link href="/">
          <View className="flex-row items-center gap-2  px-4 py-4">
            <Feather name="refresh-ccw" size={20} color="black" />
            <Text>Sync Data</Text>
          </View>
        </Link>
        <Separator />
        <Link href="/">
          <View className="flex-row items-center gap-2  px-4 py-4">
            <Feather name="settings" size={20} color="black" />
            <Text>Settings</Text>
          </View>
        </Link>
        <Separator />
        <Link href="/categories/specific/">
          <View className="flex-row items-center gap-2  px-4 py-4">
            <Feather name="pie-chart" size={20} color="black" />
            <Text>Categories</Text>
          </View>
        </Link>
      </View>
      <View className="px-4 py-2 items-center">
        <Text className="text-sm" style={{ color: theme.mutedColor }}>
          All rights reserved.Thiri-Kotoba&copy;2025
        </Text>
      </View>
    </View>
  );
};

const Separator = () => {
  const theme = useTheme();
  return (
    <View
      style={{ borderColor: theme.secondaryColor }}
      className="border-b-hairline"
    />
  );
};

export default DrawerContents;

const styles = StyleSheet.create({});
