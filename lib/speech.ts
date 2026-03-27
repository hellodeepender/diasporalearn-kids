import * as Speech from "expo-speech";
import type { Locale } from "./colors";

const LANGUAGE_MAP: Record<string, string> = {
  hy: "hy-AM",
  el: "el-GR",
  ar: "ar",
};

export async function initSpeech() {
  // no-op — kept for compatibility
}

export function speakLetter(text: string, locale: Locale) {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: LANGUAGE_MAP[locale] ?? "en-US",
      rate: 0.7,
      pitch: 1.1,
    });
  } catch {}
}

export function speakWord(word: string, locale: Locale) {
  try {
    Speech.stop();
    Speech.speak(word, {
      language: LANGUAGE_MAP[locale] ?? "en-US",
      rate: 0.6,
      pitch: 1.0,
    });
  } catch {}
}
