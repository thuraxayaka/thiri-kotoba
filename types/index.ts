import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation as useNativeNavigation } from "expo-router";
export interface Example {
  sentence: string;
  pronunciation: string;
  translation: string;
}
interface JapaneseWord {
  word: string;
  parts_of_speech: string;
  categories: string[] | string;
  english: string;
  burmese: string;
  definition?: string;
  level: string;
  formality: Formality;
  pronunciation: string;
  romaji: string;
  language: "japanese";
  synonyms?: string[] | string;
  antonyms?: string[] | string;
  frequencey: Frequency;
  favorite: boolean;
  examples: Example[];
}
interface ChineseWord {
  word: string;
  parts_of_speech: string;
  categories: string[] | string;
  english: string;
  burmese: string;
  definition?: string;
  level: string;
  formality: Formality;
  pronunciation: string;
  language: "chinese";
  synonyms?: string[] | string;
  antonyms?: string[] | string;
  frequencey: Frequency;
  favorite: boolean;
  examples: Example[];
}

interface KoreanWord {
  word: string;
  parts_of_speech: string;
  categories: string[] | string;
  english: string;
  burmese: string;
  definition?: string;
  level: string;
  formality: Formality;
  pronunciation: string;
  language: "korean";
  synonyms?: string[] | string;
  antonyms?: string[] | string;
  frequencey: Frequency;
  favorite: boolean;
  examples: Example[];
}
export type Frequency = "high" | "medium" | "low" | "very_low";
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
export type ChineseLevel =
  | "HSK 1"
  | "HSK 2"
  | "HSK 3"
  | "HSK 4"
  | "HSK 5"
  | "HSK 6";
export type JapaneseLevel =
  | "JLPT N5"
  | "JLPT N4"
  | "JLPT N3"
  | "JLPT N2"
  | "JLPT N1";
export type KoreanLevel =
  | "TOPIK 1"
  | "TOPIK 2"
  | "TOPIK 3"
  | "TOPIK 4"
  | "TOPIK 5"
  | "TOPIK 6";
export type SelectListItem<T> = {
  key: string | number;
  value: T;
};
