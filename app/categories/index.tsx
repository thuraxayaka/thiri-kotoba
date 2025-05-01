import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/hooks/Theme";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

type Category = {
  id: number;
  category: string;
};

const Categories = () => {
  const router = useRouter();
  const theme = useTheme();
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const fetchedCategories = await db.getAllAsync<Category>(
          "SELECT * FROM category"
        );
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    !loading && (
      <ScrollView>
        <View
          className="min-h-[100vh] mx-auto w-[95%]"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <TouchableOpacity className="mb-4" onPress={() => router.back()}>
            <Feather name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-[1.8rem] mb-8">Categories</Text>
          {categories.map((item, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  router.push(`/categories/${item.category}`);
                }}
              >
                <Text
                  className="py-4 mb-2 uppercase text-[.9rem] px-4 rounded-lg"
                  style={{
                    backgroundColor: theme.secondaryColor,
                    letterSpacing: 1.4,
                  }}
                >
                  {item.category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    )
  );
};

export default Categories;

const styles = StyleSheet.create({});
