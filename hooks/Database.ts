import { useSQLiteContext } from "expo-sqlite";
import japaneseData from "@/constants/japanesedummy.json";
import koreanData from "@/constants/koreandummy.json";
import chineseData from "@/constants/chinesedummy.json";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Example, Word } from "@/types";

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
    switch (data.language) {
      case "japanese":
        try {
          const addJapaneseWordStatement = await db.prepareAsync(
            `INSERT INTO japanese_word(word,parts_of_speech,categories,english,burmese,definition,level,formality,pronunciation,romaji,synonyms,antonyms,frequency,favorite)
             VALUES ($word,$parts_of_speech,$categories,$english,$burmese,$definition,$level,$formality,$pronunciation,$romaji,$synonyms,$antonyms,$frequency,$favorite);`
          );
          const addJapaneseExampleStatement = await db.prepareAsync(
            `INSERT INTO japanese_example(word_id,sentence,pronunciation,translation) VALUES ($wordId, $sentence, $pronunciation, $translation);`
          );
          let resultOfJapaneseWord =
            await addJapaneseWordStatement.executeAsync({
              $word: data.word,
              $parts_of_speech: data.partsOfSpeech,
              $categories: Array.isArray(data.categories)
                ? data.categories.join(",")
                : data.categories,
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
            });

          for (let i = 0; i < data.examples.length; i++) {
            await addJapaneseExampleStatement.executeAsync({
              $wordId: resultOfJapaneseWord.lastInsertRowId,
              $sentence: data.examples[i].sentence,
              $pronunciation: data.examples[i].pronunciation,
              $translation: data.examples[i].translation,
            });
          }
          return {
            success: true,
            lastInsertRow: resultOfJapaneseWord.lastInsertRowId,
          };
        } catch (err) {
          console.error(`@/hooks/Database.` + err);
        }
        break;
      case "chinese":
        {
          try {
            const wordData = data;
            const addChineseWordStatement = await db.prepareAsync(
              `INSERT INTO chinese_word(word,parts_of_speech,categories,english,burmese,definition,level,formality,pinyin,pinyin_simplified,synonyms,antonyms,frequency,favorite)
                 VALUES ($word,$parts_of_speech,$categories,$english,$burmese,$definition,$level,$formality,$pinyin,$pinyin_simplified,$synonyms,$antonyms,$frequency,$favorite);`
            );

            const addChineseExampleStatement = await db.prepareAsync(
              `INSERT INTO chinese_example(word_id,sentence,pronunciation,translation) VALUES ($wordId,$sentence,$pronunciation,$translation);`
            );

            let resultOfChineseWord =
              await addChineseWordStatement.executeAsync({
                $word: wordData.word,
                $parts_of_speech: wordData.partsOfSpeech,
                $categories: Array.isArray(wordData.categories)
                  ? wordData.categories.join(",")
                  : wordData.categories,
                $burmese: wordData.burmese,
                $english: wordData.english,
                $definition: wordData.definition,
                $level: wordData.level,
                $formality: wordData.formality,
                $pinyin: wordData.pinyin,
                $pinyin_simplified: removeDiacratics(wordData.pinyin),
                $synonyms: Array.isArray(wordData.synonyms)
                  ? wordData.synonyms.join(",")
                  : wordData.synonyms,
                $antonyms: Array.isArray(wordData.antonyms)
                  ? wordData.antonyms.join(",")
                  : wordData.antonyms,
                $frequency: wordData.frequency,
                $favorite: 0,
              });
            for (let i = 0; i < wordData.examples.length; i++) {
              await addChineseExampleStatement.executeAsync({
                $wordId: resultOfChineseWord.lastInsertRowId,
                $sentence: wordData.examples[i].sentence,
                $pronunciation: wordData.examples[i].pronunciation,
                $translation: wordData.examples[i].translation,
              });
            }
            return {
              success: true,
              lastInsertRow: resultOfChineseWord.lastInsertRowId,
            };
          } catch (err) {
            console.log(
              "error inserting to chinese_word in Database.ts.Caused by: " + err
            );
          }
        }
        break;
      case "korean": {
        try {
          const wordData = data;
          const addKoreanWordStatement = await db.prepareAsync(
            `INSERT INTO korean_word(word,parts_of_speech,categories,english,burmese,definition,level,formality,romaji,synonyms,antonyms,frequency,favorite)
           VALUES ($word,$parts_of_speech,$categories,$english,$burmese,$definition,$level,$formality,$romaji,$synonyms,$antonyms,$frequency,$favorite);`
          );
          const addKoreanExampleStatement = await db.prepareAsync(
            `INSERT INTO korean_example(word_id,sentence,pronunciation,translation) VALUES ($wordId,$sentence,$pronunciation,$translation);`
          );
          let resultOfKoreanWord = await addKoreanWordStatement.executeAsync({
            $word: wordData.word,
            $parts_of_speech: wordData.partsOfSpeech,
            $categories: Array.isArray(wordData.categories)
              ? wordData.categories.join(",")
              : wordData.categories,
            $burmese: wordData.burmese,
            $english: wordData.english,
            $definition: wordData.definition,
            $level: wordData.level,
            $formality: wordData.formality,
            $romaji: wordData.romaji,
            $synonyms: Array.isArray(wordData.synonyms)
              ? wordData.synonyms.join(",")
              : wordData.synonyms,
            $antonyms: Array.isArray(wordData.antonyms)
              ? wordData.antonyms.join(",")
              : wordData.antonyms,
            $frequency: wordData.frequency,
            $favorite: 0,
          });
          for (let i = 0; i < wordData.examples.length; i++) {
            await addKoreanExampleStatement.executeAsync({
              $wordId: resultOfKoreanWord.lastInsertRowId,
              $sentence: wordData.examples[i].sentence,
              $pronunciation: wordData.examples[i].pronunciation,
              $translation: wordData.examples[i].translation,
            });
          }

          return {
            success: true,
            lastInsertRow: resultOfKoreanWord.lastInsertRowId,
          };
        } catch (err) {
          console.log(
            "error populating data to korean_word in Database.ts.Caused by:" +
              err
          );
        }
      }
    }

    return { success: false, lastInsertRow: 0 };
  }

  // async function getTableData(
  //   tableName: string,
  //   { ...conditions }: object
  // ): Promise<Array<any>> {
  //   console.log(conditions);
  //   return await db.getAllAsync(
  //     `SELECT * FROM ${tableName} JOIN word ON word.id = ${tableName}.word_id WHERE `
  //   );
  // }

  return { setup, clearAll, getAllTables, loading, insertData };
};
