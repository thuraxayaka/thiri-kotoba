import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MateriralCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/hooks/Theme";
import { TouchableHighlight, View } from "react-native";
import { setTabbarHeight } from "@/stores/settingSlice";
import { AppDispatch } from "@/stores/store";
import { useAppDispatch } from "@/hooks/Hook";

export default function TabsLayout() {
  const dispatch = useAppDispatch<AppDispatch>();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accentColor,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.primaryColor,
          borderColor: theme.accentColor,
        },
        headerStyle: {
          backgroundColor: theme.primaryColor,
        },
        tabBarButton: ({ children, onPress }) => {
          return (
            <TouchableHighlight
              onPress={onPress}
              underlayColor={theme.secondaryColor}
              onLayout={(e) =>
                dispatch(setTabbarHeight(e.nativeEvent.layout.height))
              }
            >
              <View className="justify-center items-center h-[100%]">
                {children}
              </View>
            </TouchableHighlight>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={24}
              color={theme.accentColor}
            />
          ),
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="flashcards"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MateriralCommunityIcons
              name={focused ? "cards" : "cards-outline"}
              size={24}
              color={theme.accentColor}
            />
          ),
          tabBarLabel: "Flash Cards",
        }}
      />
    </Tabs>
  );
}
