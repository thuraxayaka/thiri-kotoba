import React, { useEffect, useState } from "react";
import N5Words from "@/constants/N5.json";
import N4Words from "@/constants/N4.json";
import N3Words from "@/constants/N3.json";
import N2Words from "@/constants/N2.json";
import N1Words from "@/constants/N1.json";
import AllWords from "@/constants/japanese_eng.json";
import Words from "@/constants/words.json";

type Word = {
  expression: string;
  meaning: string;
  reading: string;
  tags: string;
};
export const useDictionary = (prefix: string) => {
  const [data, setData] = React.useState<Word[] | undefined>();
  const [error, setError] = React.useState<undefined | string>("");

  useEffect(() => {
    switch (prefix) {
      case "N5":
        setData(N5Words);
        break;
      case "N4":
        setData(N4Words);
        break;
      case "N3":
        setData(N3Words);
        break;
      case "N2":
        setData(N2Words);
        break;
      case "N1":
        setData(N1Words);
        break;
      default:
        setData(AllWords);
    }
    setData(N5Words);
  }, [prefix]);
  return { data };
};

export const useInitializiedWords = () => {
  const [words, setWords] = useState<Word[]>([]);

  // useDatabase();
  return { words };
};
