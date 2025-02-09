import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import store from "@/stores/store";
import {
  useSQLiteContext,
  type SQLiteDatabase,
  SQLiteProvider,
} from "expo-sqlite";
import { Provider } from "react-redux";
import "../global.css";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <SQLiteProvider databaseName="thiri-kotoba.db" onInit={migrateDb}>
          <Provider store={store}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="details" options={{ headerShown: false }} />
            </Stack>
          </Provider>
        </SQLiteProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const migrateDb = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1; // current schema version
  let result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version AS user_version");
  const currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // Run migrations if needed
  if (currentDbVersion === 0) {
    // Initial migration
    await db.execAsync(`CREATE TABLE word (
      id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
      word TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      definition TEXT NOT NULL,
      isFavorite INTEGER);
    `);
    await db.execAsync(`CREATE TABLE japanese(
      id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
      kanji TEXT,
      hiragana TEXT,
      romaji TEXT,
      level: TEXT,
      formality: TEXT,
      synonyms: TEXT,
      antonyms: TEXT,
      word_id INTEGER,
      FOREIGN KEY(word_id) REFERENCES ON word(id) ON CASCADES DELETE
      );`)
  }

  // Increment the version after migration
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paragraph: {
    fontSize: 22,
    padding: 12,
  },
});
