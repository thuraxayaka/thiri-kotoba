import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MateriralCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/hooks/Theme";
import { Pressable } from "react-native";

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accentColor,
        tabBarStyle: {
          backgroundColor: theme.primaryColor,
          borderColor: theme.accentColor,
        },
        headerStyle: {
          backgroundColor: theme.primaryColor,
        },
        tabBarButton: (props) => {
          return (
            <Pressable
              {...props}
              style={({ pressed }) => [
                {
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  backgroundColor: pressed
                    ? `${theme.secondaryColor}`
                    : "transparent",
                  borderRadius: 50,
                },
              ]}
            />
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
        name="category"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "layers" : "layers-outline"}
              size={24}
              color={theme.accentColor}
            />
          ),
          tabBarLabel: "Group By",
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
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={theme.accentColor}
            />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
