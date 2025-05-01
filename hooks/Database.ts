import { useSQLiteContext } from "expo-sqlite";
import japaneseData from "@/constants/japanesedummy.json";
import koreanData from "@/constants/koreandummy.json";
import chineseData from "@/constants/chinesedummy.json";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ChineseWord, Example, JapaneseWord, KoreanWord, Word } from "@/types";

const removeDiacratics = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
export const useSqlite = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const db = useSQLiteContext();
  async function setup(): Promise<{
    completedCount: number;
    totalCount: number;
    loading: boolean;
  }> {
    setLoading(true);
    //populate data

    let completedCount = 0;
    let totalCount =
      japaneseData.length + koreanData.length + chineseData.length;
    for (let i = 0; i < japaneseData.length; i++) {
      const { success } = await insertData(japaneseData[i]);
      if (success) completedCount++;
    }
    for (let i = 0; i < koreanData.length; i++) {
      const { success } = await insertData(koreanData[i]);
      if (success) completedCount++;
    }

    for (let i = 0; i < chineseData.length; i++) {
      const { success } = await insertData(chineseData[i]);
      if (success) completedCount++;
    }
    if (completedCount === totalCount) {
      setLoading(false);
    }

    return { completedCount, totalCount, loading };
  }
  async function getAllTables(): Promise<{ name: string }[] | undefined> {
    try {
      const tables = await db.getAllAsync<{ name: string }>(
        "SELECT name from sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );

      return tables;
    } catch (err) {
      console.error("failed to get tables: " + err);
    }
  }
  async function clearAll() {
    try {
      const tables = await db.getAllAsync<{ name: string }>(
        "SELECT name from sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );
      for (const table of tables) {
        const tableName = table.name;
        console.log("clearing table :" + tableName);
        await db.execAsync(`DELETE FROM ${tableName} `);
        // await db.execAsync(`DROP TABLE ${tableName}`);
      }
      await SecureStore.deleteItemAsync("populated");
    } catch (err) {
      console.error("failed to clear tables: " + err);
    }
  }

  async function insertData(
    data: any
  ): Promise<{ success: boolean; lastInsertRow: number | string }> {
    const japaneseWordInsertionStatement = await db.prepareAsync(
      `INSERT INTO japanese_word(word,parts_of_speech,english,burmese,definition,level,formality,pronunciation,romaji,synonyms,antonyms,frequency,favorite)
       VALUES ($word,$parts_of_speech,$english,$burmese,$definition,$level,$formality,$pronunciation,$romaji,$synonyms,$antonyms,$frequency,$favorite);`
    );
    const chineseWordInsertionStatement = await db.prepareAsync(
      `INSERT INTO chinese_word(word,parts_of_speech,english,burmese,definition,level,formality,pinyin,pinyin_simplified,synonyms,antonyms,frequency,favorite)
         VALUES ($word,$parts_of_speech,$english,$burmese,$definition,$level,$formality,$pinyin,$pinyin_simplified,$synonyms,$antonyms,$frequency,$favorite);`
    );
    const koreanWordInsertionStatement = await db.prepareAsync(
      `INSERT INTO korean_word(word,parts_of_speech,english,burmese,definition,level,formality,romaji,synonyms,antonyms,frequency,favorite)
     VALUES ($word,$parts_of_speech,$english,$burmese,$definition,$level,$formality,$romaji,$synonyms,$antonyms,$frequency,$favorite);`
    );

    const exampleInsertionStatement = await db.prepareAsync(
      `INSERT INTO ${data.language}_example(word_id,sentence,pronunciation,translation) VALUES ($wordId, $sentence, $pronunciation, $translation);`
    );
    const wordCategoryInsertionStatement = await db.prepareAsync(
      `INSERT INTO word_category(word_id,language,category_id) VALUES($word_id,$language,$category_id);`
    );
    const executeStatement = async (): Promise<{ lastInsertRow: number }> => {
      let result: any;
      switch (data.language) {
        case "japanese":
          {
            try {
              result =
                await japaneseWordInsertionStatement.executeAsync<JapaneseWord>(
                  {
                    $word: data.word,
                    $parts_of_speech: data.partsOfSpeech,
                    $burmese: data.burmese,
                    $english: data.english,
                    $definition: data.definition,
                    $level: data.level,
                    $formality: data.formality,
                    $pronunciation: data.pronunciation,
                    $romaji: data.romaji,
                    $synonyms: Array.isArray(data.synonyms)
                      ? data.synonyms.join(",")
                      : data.synonyms,
                    $antonyms: Array.isArray(data.antonyms)
                      ? data.antonyms.join(",")
                      : data.antonyms,
                    $frequency: data.frequency,
                    $favorite: 0,
                  }
                );
            } catch (err) {
              console.error(
                "Error: Inserting japanese_word fields.Caused by " + err
              );
            }
          }
          break;
        case "chinese":
          {
            try {
              result =
                await chineseWordInsertionStatement.executeAsync<ChineseWord>({
                  $word: data.word,
                  $parts_of_speech: data.partsOfSpeech,
                  $burmese: data.burmese,
                  $english: data.english,
                  $definition: data.definition,
                  $level: data.level,
                  $formality: data.formality,
                  $pinyin: data.pinyin,
                  $pinyin_simplified: removeDiacratics(data.pinyin),
                  $synonyms: Array.isArray(data.synonyms)
                    ? data.synonyms.join(",")
                    : data.synonyms,
                  $antonyms: Array.isArray(data.antonyms)
                    ? data.antonyms.join(",")
                    : data.antonyms,
                  $frequency: data.frequency,
                  $favorite: 0,
                });
            } catch (err) {
              console.error(
                "Error: Inserting to chinese_word.Caused by " + err
              );
            }
          }
          break;
        case "korean": {
          try {
            result =
              await koreanWordInsertionStatement.executeAsync<KoreanWord>({
                $word: data.word,
                $parts_of_speech: data.partsOfSpeech,
                $burmese: data.burmese,
                $english: data.english,
                $definition: data.definition,
                $level: data.level,
                $formality: data.formality,
                $romaji: data.romaji,
                $synonyms: Array.isArray(data.synonyms)
                  ? data.synonyms.join(",")
                  : data.synonyms,
                $antonyms: Array.isArray(data.antonyms)
                  ? data.antonyms.join(",")
                  : data.antonyms,
                $frequency: data.frequency,
                $favorite: 0,
              });
          } catch (err) {
            console.error("Error: Inserting to korean_word.Caused by " + err);
          }
        }
      }

      const existingCategories = await db.getAllAsync<{
        id: number;
        category: string;
      }>("SELECT * FROM category;");

      const processCategories = async (categories: string | string[]) => {
        const categoryList = Array.isArray(categories)
          ? categories
          : categories.split(",");
        for (let category of categoryList) {
          const trimmedCategory = category.trim();
          if (!trimmedCategory) continue;

          let categoryId: number | undefined;
          const existingCategory = existingCategories.find(
            (value) => value.category === trimmedCategory
          );

          if (existingCategory) {
            categoryId = existingCategory.id;
          } else {
            const insertCategoryStatement = await db.prepareAsync(
              "INSERT INTO category(category) VALUES ($category);"
            );
            const resultOfCategoryInsert =
              await insertCategoryStatement.executeAsync({
                $category: trimmedCategory,
              });
            categoryId = resultOfCategoryInsert.lastInsertRowId;
          }
          try {
            await wordCategoryInsertionStatement.executeAsync({
              $word_id: result.lastInsertRowId,
              $language: data.language,
              $category_id: categoryId,
            });
          } catch (err) {
            console.error("Error: Inserting to word_category.Caused by " + err);
          }
        }
      };
      try {
        await processCategories(data.categories);
      } catch (err) {
        console.error(
          "Error: Processng categories in Database.ts . Casued by " + err
        );
      }

      for (let example of data.examples) {
        try {
          await exampleInsertionStatement.executeAsync({
            $wordId: result.lastInsertRowId,
            $sentence: example.sentence,
            $pronunciation: example.pronunciation,
            $translation: example.translation,
          });
        } catch (err) {
          console.error("Error: Inserting into examples.Caused by: " + err);
        }
      }

      return { lastInsertRow: result.lastInsertRowId };
    };

    try {
      const { lastInsertRow } = await executeStatement();
      return { success: true, lastInsertRow };
    } catch (err) {
      console.log("Error in executing statements.Caused by " + err);
      return { success: false, lastInsertRow: -1 };
    }
  }

  return { setup, clearAll, getAllTables, loading, insertData };
};
