import SearchBox from "@/components/SearchBox";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContents from "@/components/DrawerContents";
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={() => <DrawerContents />}
        screenOptions={{
          headerTitle: "Home",
        }}
      >
        <Drawer.Screen
          name="(tabs)" // This corresponds to the (tabs) directory
          options={{
            header: () => <SearchBox />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
