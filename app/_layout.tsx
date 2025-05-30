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
    }>("PRAGMA user_version = 0");

    const currentDbVersion = result?.user_version ?? 0;
    if (currentDbVersion >= DATABASE_VERSION) {
      return;
    }
    console.log("Migration Needed.Running migration....");
    // Run migrations if needed
    if (currentDbVersion === 0) {
      // Initial migration
      await db.execAsync(`CREATE TABLE IF NOT EXISTS category(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category VARCHAR(25) UNIQUE NOT NULL);
      `);
      console.log("created category table...");
      await db.execAsync(`CREATE TABLE IF NOT EXISTS japanese_word (
      id INTEGER PRIMARY KEY  AUTOINCREMENT,
      word TEXT NOT NULL,
      parts_of_speech TEXT NOT NULL,
      english TEXT NOT NULL,
      burmese TEXT NOT NULL,
      definition TEXT,
      level TEXT NOT NULL,
      formality TEXT NOT NULL,
      pronunciation TEXT NOT NULL,
      romaji TEXT NOT NULL,
      synonyms TEXT,
      antonyms TEXT,
      frequency TEXT NOT NULL,
      favorite INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

      console.log("created table japanese_word...");
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS japanese_example(
      id INTEGER PRIMARY KEY  AUTOINCREMENT,
      word_id INTEGER,
      sentence TEXT NOT NULL,
      pronunciation TEXT NOT NULL,
      translation TEXT NOT NULL,
      FOREIGN KEY (word_id) REFERENCES japanese_word(id) ON DELETE CASCADE
      );`);

      await db.execAsync(`CREATE TABLE IF NOT EXISTS chinese_word (
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word TEXT NOT NULL,
        parts_of_speech TEXT NOT NULL,
        english TEXT NOT NULL,
        burmese TEXT NOT NULL,
        definition TEXT,
        level TEXT NOT NULL,
        formality TEXT NOT NULL,
        pinyin TEXT NOT NULL,
        pinyin_simplified TEXT NOT NULL,
        synonyms TEXT,
        antonyms TEXT,
        frequency TEXT NOT NULL,
        favorite INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("created table chinese_word...");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS chinese_example(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word_id INTEGER,
        sentence TEXT NOT NULL,
        pronunciation TEXT NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY (word_id) REFERENCES chinese_word(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`CREATE TABLE IF NOT EXISTS korean_word (
          id INTEGER PRIMARY KEY  AUTOINCREMENT,
          word TEXT NOT NULL,
          parts_of_speech TEXT NOT NULL,
          english TEXT NOT NULL,
          burmese TEXT NOT NULL,
          definition TEXT,
          level TEXT NOT NULL,
          formality TEXT NOT NULL,
          romaji TEXT NOT NULL,
          synonyms TEXT,
          antonyms TEXT,
          frequency TEXT NOT NULL,
          favorite INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
      console.log("created table korean_word...");
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS korean_example(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        word_id INTEGER,
        sentence TEXT NOT NULL,
        pronunciation NOT NULL,
        translation TEXT NOT NULL,
        FOREIGN KEY (word_id) REFERENCES korean_word(id) ON DELETE CASCADE
        );`);
      await db.execAsync(`
          CREATE TABLE IF NOT EXISTS word_category(
          word_id INT NOT NULL,
          language TEXT NOT NULL,
          category_id INT NOT NULL,
          PRIMARY KEY (word_id, language, category_id),
          FOREIGN KEY (category_id) REFERENCES category(id)
          )`);

      console.log("created word category...");
    }

    // Increment the version after migration
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  } catch (err) {
    console.log(err);
  }
};
