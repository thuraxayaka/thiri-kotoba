import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, Link } from "expo-router";
const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Opps! Not Found" }} />
      <View style={styles.container}>
        <Link href="/">
          <Text>Go Back to Home Screen</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
