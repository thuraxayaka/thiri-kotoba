import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation as useNativeNavigation } from "expo-router";
interface BaseWord {
  id: number;
  level: string;
  type: PartsOfSpeech;
  translation: string;
  definition: string;
  category: string;
  formality: Formality;
}
export interface Example {
  sentence: string;
  phonetic: string;
  translation: string;
}
interface JapaneseWord extends BaseWord {
  language: "japanese";
  kanji: string;
  hiragana: string;
  romaji: string;
  synonyms?: string[];
  antonyms?: string[];
  formality: Formality;
  examples: Example[];
}
interface ChineseWord extends BaseWord {
  language: "chinese";
  hanzi: string;
  pinyin: string;
  examples: Example[];
  formality: Formality;
}

interface KoreanWord extends BaseWord {
  language: "korean";
  hangul: string;
  romaji: string;
  examples: Example[];
  formality: Formality;
}

interface WordDetails {
  word: Word;
  examples: Example[];
}
export type Map<T> = {
  [key: string]: T;
};
type Language = "japanese" | "chinese" | "korean";
type Word = JapaneseWord | KoreanWord | ChineseWord;

export { Word, WordDetails, Language, JapaneseWord, KoreanWord, ChineseWord };

type drawerParamList = {
  "(tabs)": undefined;
  details: undefined;
  "+not-found": undefined;
};
export type DrawerNavigation = DrawerNavigationProp<drawerParamList>;
export function useNavigation() {
  return useNativeNavigation<DrawerNavigation>();
}
export type PartsOfSpeech =
  | "noun"
  | "adjective"
  | "conjunction"
  | "preposition"
  | "pronoun"
  | "adverb"
  | "interjection"
  | "verb";

export type Formality =
  | "rude"
  | "polite"
  | "neutral"
  | "formal"
  | "informal"
  | "casual";
export type stepMapper = {
  [key: number]: JSX.Element;
};
export type ChineseLevel = "HSK 1" | "HSK 2" | "HSK 3" | "HSK 4" | "HSK 5" | "HSK 6";
export type JapaneseLevel = "JLPT N5" | "JLPT N4" | "JLPT N3" | "JLPT N2" | "JLPT N1"
export type KoreanLevel = "TOPIK 1" | "TOPIK 2" | "TOPIK 3" | "TOPIK 4" | "TOPIK 5" | "TOPIK 6"