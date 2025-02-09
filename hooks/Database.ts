import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";

import words from "@/constants/words.json";
export const useDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("thiri-kotoba.db");

  const isDBSetup = await SecureStore.getItemAsync("setupDone");
  if (!isDBSetup) {
    await setupDatabase(db);
  }
};
const setupDatabase = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync("PRAGMA journal_mode= WAL");
    await db.execAsync("PRAGMA foreign_keys = ON");
  } catch (err) {
    console.log(err);
  }
};
