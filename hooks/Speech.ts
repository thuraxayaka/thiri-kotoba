import * as Speech from "expo-speech";
import { Alert, Linking, Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "expo-router";

const useSpeech = () => {
  const languageMapper: Record<string, string> = {
    japanese: "ja-JP",
    chinese: "zh-CN",
    korean: "ko-KR",
  };

  const speak = useCallback(async (lang: string, word: string) => {
    const langCode = languageMapper[lang];
    await Speech.stop();

    const speechOptions = {
      language: langCode,
    };
    Speech.speak(word, speechOptions);
  }, []);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        ["zh-CN", "ko-KR", "ja-JP"].forEach((language) => {
          const targetLang = voices.find((voice) => {
            return voice.language === language;
          });
          if (!targetLang) {
            Alert.alert(
              `TTS Engine required`,
              "please install a text-to-speech engine",
              [
                {
                  text: "install",
                  onPress: () => {
                    if (Platform.OS === "android") {
                      Linking.openURL(
                        "market://details?id=com.google.android.tts"
                      );
                    } else {
                      Linking.openURL("app-settings");
                    }
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                },
              ]
            );
          }
        });
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };
    loadVoices();
  }, []);

  return { speak };
};
export default useSpeech;
