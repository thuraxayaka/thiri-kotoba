import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import store from "@/stores/store";
import { Stack } from "expo-router";
import { type SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { Provider } from "react-redux";
import "../global.css";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Provider store={store}>
          <SQLiteProvider databaseName="thiri-kotoba.db" onInit={migrateDb}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="details" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SQLiteProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const migrateDb = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1; // current schema version
  let result;
  try {
    result = await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version");

    const currentDbVersion = result?.user_version ?? 0;
    if (currentDbVersion >= DATABASE_VERSION) {
      return;
    }
    console.log("Migration Needed.Running migration....");
    // Run migrations if needed
    if (currentDbVersion === 0) {
      // Initial migration
      await db.execAsync(`CREATE TABLE IF NOT EXISTS word (
      id INTEGER PRIMARY KEY  AUTOINCREMENT,
      word TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      definition TEXT NOT NULL,
      translation TEXT NOT NULL,
      isFavorite INTEGER);
    `);

      await db.execAsync(`CREATE TABLE IF NOT EXISTS japanese(
      id INTEGER PRIMARY KEY  AUTOINCREMENT,
      kanji TEXT NOT NULL,
      hiragana TEXT NOT NULL,
      romaji TEXT NOT NULL,
      level TEXT,
      formality TEXT,
      synonyms TEXT,
      antonyms TEXT,
      word_id INTEGER,
      FOREIGN KEY (word_id) REFERENCES  word(id) ON DELETE CASCADE
      );`);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS chinese(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hanzi TEXT  NOT NULL,
        pinyin TEXT NOT NULL,
        pinyin_simplified TEXT NOT NULL,
        level TEXT,
        formality TEXT,
        word_id INTEGER,
        FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS korean(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        hangul TEXT  NOT NULL,
        romaji TEXT NOT NULL,
        level TEXT,
        formality TEXT,
        word_id INTEGER,
        FOREIGN KEY (word_id) REFERENCES word(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS korean_example(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word_id INTEGER,
        sentence TEXT NOT NULL,
        phonetic TEXT NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY (word_id) REFERENCES korean(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS japanese_example(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word_id INTEGER,
        sentence TEXT NOT NULL,
        phonetic TEXT NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY (word_id) REFERENCES japanese(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS chinese_example(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word_id INTEGER,
        sentence TEXT NOT NULL,
        phonetic TEXT NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY (word_id) REFERENCES chinese(id) ON DELETE CASCADE
        );`);
    }

    // Increment the version after migration
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  } catch (err) {
    console.log(err);
  }
};
