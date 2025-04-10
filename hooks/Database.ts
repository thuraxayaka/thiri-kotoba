import { useSQLiteContext } from "expo-sqlite";
import data from "@/constants/dummy.json";
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
  }> {
    setLoading(true);
    //populate data

    let completedCount = 0;
    let totalCount = data.length;

    for (let i = 0; i < totalCount; i++) {
      try {
        const word = data[i];
        const japaneseExamples = word.japanese.examples;
        const koreanExamples = word.korean.examples;
        const chineseExamples = word.chinese.examples;

        const addWord = await db.prepareAsync(
          "INSERT INTO word(word,type,category,definition,translation,isFavorite) VALUES ($word,$type,$category,$definition,$translation,$isFavorite);"
        );
        const addJapaneseStat = await db.prepareAsync(
          `INSERT INTO japanese(kanji,hiragana,romaji,level,formality,synonyms,antonyms,word_id) VALUES ($kanji,$hiragana,$romaji,$level,$formality,$synonyms,$antonyms,$wordId);`
        );
        const addChineseStat = await db.prepareAsync(
          `INSERT INTO chinese(hanzi,pinyin,pinyin_simplified,level,formality,word_id) VALUES($hanzi,$pinyin,$pinyin_simplified,$level,$formality,$wordId);`
        );
        const addKoreanStat = await db.prepareAsync(
          `INSERT INTO korean (hangul,romaji,level,formality,word_id) VALUES ($hangul,$romaji, $level,$formality,$wordId);`
        );
        const addKoreanExampleStat = await db.prepareAsync(
          `INSERT INTO korean_example(word_id,sentence,phonetic,translation) VALUES ($wordId,$sentence,$romaji,$translation);`
        );
        const addJapaneseExampleStat = await db.prepareAsync(
          `INSERT INTO japanese_example(word_id,sentence,phonetic,translation) VALUES ($wordId, $sentence, $romaji, $translation);`
        );
        const addChineseExampleStat = await db.prepareAsync(
          `INSERT INTO chinese_example(word_id,sentence,phonetic,translation) VALUES ($wordId,$sentence,$pinyin,$translation);`
        );

        let wordResult = await addWord.executeAsync({
          $word: word.japanese.kanji,
          $type: word.type,
          $category: word.category,
          $definition: word.definition,
          $translation: word.burmese.translation,
          $isFavorite: 0,
        });
        await addWord.finalizeAsync();
        let japaneseResult = await addJapaneseStat.executeAsync({
          $kanji: word.japanese.kanji,
          $hiragana: word.japanese.hiragana,
          $romaji: word.japanese.romaji,
          $level: word.japanese.level,
          $formality: word.japanese.formality,
          $synonyms: word.japanese.synonyms.join(",") || null,
          $antonyms: word.japanese.antonyms.join(",") || null,
          $wordId: wordResult.lastInsertRowId,
        });
        await addJapaneseStat.finalizeAsync();

        for (let i = 0; i < japaneseExamples.length; i++) {
          await addJapaneseExampleStat.executeAsync({
            $wordId: japaneseResult.lastInsertRowId,
            $sentence: japaneseExamples[i].sentence,
            $romaji: japaneseExamples[i].phonetic,
            $translation: japaneseExamples[i].translation,
          });
        }
        await addJapaneseExampleStat.finalizeAsync();
        let chineseResult = await addChineseStat.executeAsync({
          $hanzi: word.chinese.hanzi,
          $pinyin: word.chinese.pinyin,
          $pinyin_simplified: removeDiacratics(word.chinese.pinyin),
          $level: word.chinese.level,
          $formality: word.chinese.formality,
          $wordId: wordResult.lastInsertRowId,
        });
        await addChineseStat.finalizeAsync();

        for (let i = 0; i < chineseExamples.length; i++) {
          await addChineseExampleStat.executeAsync({
            $wordId: chineseResult.lastInsertRowId,
            $sentence: chineseExamples[i].sentence,
            $pinyin: chineseExamples[i].phonetic,
            $translation: chineseExamples[i].translation,
          });
        }
        await addChineseExampleStat.finalizeAsync();

        let koreanResult = await addKoreanStat.executeAsync({
          $hangul: word.korean.hangul,
          $romaji: word.korean.romaji,
          $level: word.korean.level,
          $formality: word.korean.formality,
          $wordId: wordResult.lastInsertRowId,
        });
        await addKoreanStat.finalizeAsync();
        for (let i = 0; i < koreanExamples.length; i++) {
          await addKoreanExampleStat.executeAsync({
            $wordId: koreanResult.lastInsertRowId,
            $sentence: koreanExamples[i].sentence,
            $romaji: koreanExamples[i].phonetic,
            $translation: koreanExamples[i].translation,
          });
        }
        await addKoreanExampleStat.finalizeAsync();

        completedCount++;
        if (completedCount === totalCount) {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }

    return { completedCount, totalCount };
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

  async function addToTable(data: any) : Promise<{success: boolean,lastInsertRow: number | string}> {
    const addWord = await db.prepareAsync(
      "INSERT INTO word(word,type,category,definition,translation,isFavorite) VALUES ($word,$type,$category,$definition,$translation,$isFavorite);"
    );
   
    let wordResult,insertedWordId:number;
    switch(data.language) {
      case "japanese" :
      case "korean":

        try {

          wordResult = await addWord.executeAsync({
            $word : data.romaji, 
            $type: data.type,
            $category: data.category,
            $definition: data.definition,
            $translation: data.translation,
            $isFavorite: 0
          });
          insertedWordId = wordResult?.lastInsertRowId;
          
          if(data.language === 'japanese') {
            const addJapaneseStat = await db.prepareAsync(
              `INSERT INTO japanese(kanji,hiragana,romaji,level,formality,synonyms,antonyms,word_id) VALUES ($kanji,$hiragana,$romaji,$level,$formality,$synonyms,$antonyms,$wordId);`
            );
           
            const addJapaneseExampleStat = await db.prepareAsync(
              `INSERT INTO japanese_example(word_id,sentence,phonetic,translation) VALUES ($wordId, $sentence, $romaji, $translation);`
            );
            try {
  
              await addJapaneseStat.executeAsync({
                $kanji: data.kanji,
                $hiragana: data.hiragana,
                $romaji: data.romaji,
                $level: data.level,
                $formality: data.formality,
                $synonyms:  null,
                $antonyms: null,
                $wordId: wordResult.lastInsertRowId,
              });

              
    
              data.examples?.map(async(example:Example) => {
                 await addJapaneseExampleStat.executeAsync({
                  $wordId: insertedWordId,
                  $sentence: example.sentence,
                  $romaji:  example.phonetic,
                  $translation: example.translation
                })
              })
              return {success: true,lastInsertRow: insertedWordId}
            }catch(err) {
              console.log("Error in adding japanese word inside Database.ts" + err);
            }
          }
          if(data.language === 'korean') {
            const addKoreanStat = await db.prepareAsync("INSERT INTO korean(hangul,romaji,level,formality,wordId) VALUES ($hangul,$romaji,$level,$formality,$wordId");
            const addKoreanExampleStat = await db.prepareAsync(
              `INSERT INTO korean_example(word_id,sentence,phonetic,translation) VALUES ($wordId,$sentence,$romaji,$translation);`
            );

            try {
              await addKoreanStat.executeAsync({
                $hangul: data.hangul,
                $romaji: data.romaji,
                $level: data.level,
                $formality: data.formality,
                $wordId: wordResult.lastInsertRowId,
              })
  
              data.examples?.map(async(example:Example) => {
                await addKoreanExampleStat.executeAsync({
                  $wordId: insertedWordId,
                  $sentence:example.sentence,
                  $romaji:example.phonetic,
                  $translation:example.translation,
                })
              })
              return {success: true,lastInsertRow: insertedWordId}
            }catch(err) {
              console.log("Error in adding korean word in Database.ts." + err)
            }
        }
        }catch(err) {
          console.log("Error in adding word japanese or korean inside Database.ts." + err)
        }
        break;
      case 'chinese': 

      try {
        wordResult = await addWord.executeAsync({
          $word : data.pinyin, 
          $type: data.type,
          $category: data.category,
          $definition: data.definition,
          $translation: data.translation,
          $isFavorite: 0
      })
    insertedWordId = wordResult?.lastInsertRowId;
    
    const addChineseStat = await db.prepareAsync(
      `INSERT INTO chinese(hanzi,pinyin,pinyin_simplified,level,formality,word_id) VALUES($hanzi,$pinyin,$pinyin_simplified,$level,$formality,$wordId);`
    );
    const addChineseExampleStat = await db.prepareAsync(
      `INSERT INTO chinese_example(word_id,sentence,phonetic,translation) VALUES ($wordId,$sentence,$pinyin,$translation);`
    );
    try {

      await addChineseStat.executeAsync({
        $hanzi: data.hanzi,
        $pinyin: data.pinyin,
        $pinyin_simplified: removeDiacratics(data.pinyin),
        $level: data.level,
        $formality: data.formality,
        $wordId: insertedWordId,
      });
      data.examples?.map(async(example:Example) => {
        await addChineseExampleStat.executeAsync({
          $wordId: insertedWordId,
          $sentence: example.sentence,
          $pinyin: example.phonetic,
          $translation: example.translation,
        })
      })
      return {success: true,lastInsertRow: insertedWordId}
    }catch(err) {
      console.log("error in adding word to chinese in Database.ts." + err);
    }

      }catch(err) {
        console.log("error in adding word to chinese in Database.ts." + err);
      }
  }

    
   

   
    return {success: false,lastInsertRow: 0 };
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

  return { setup, clearAll, getAllTables, loading,addToTable };
};
