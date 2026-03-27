import * as Speech from "expo-speech";
import type { Locale } from "./colors";

const LANGUAGE_MAP: Record<string, string> = {
  hy: "hy-AM",
  el: "el-GR",
  ar: "ar",
};

// Track which languages are actually available on this device
const languageAvailable: Record<string, boolean | null> = {
  hy: null, // null = not checked yet
  el: null,
  ar: null,
};

async function checkLanguageAvailable(locale: Locale): Promise<boolean> {
  // If already checked, return cached result
  if (languageAvailable[locale] !== null) {
    return languageAvailable[locale] as boolean;
  }

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const targetLang = LANGUAGE_MAP[locale] ?? "";
    const langPrefix = targetLang.split("-")[0]; // "hy" from "hy-AM"

    const found = voices.some(v =>
      v.language === targetLang ||
      v.language.startsWith(langPrefix + "-") ||
      v.language === langPrefix
    );

    languageAvailable[locale] = found;
    return found;
  } catch {
    // Can't check — assume available and let it try
    languageAvailable[locale] = true;
    return true;
  }
}

export async function initSpeech() {
  // Pre-check all languages on app start
  await Promise.all([
    checkLanguageAvailable("hy"),
    checkLanguageAvailable("el"),
    checkLanguageAvailable("ar"),
  ]);
}

export function speakLetter(text: string, locale: Locale) {
  try {
    // If we've checked and the language is NOT available, skip entirely
    // This prevents English mispronunciation of Armenian text
    if (languageAvailable[locale] === false) return;

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
    if (languageAvailable[locale] === false) return;

    Speech.stop();
    Speech.speak(word, {
      language: LANGUAGE_MAP[locale] ?? "en-US",
      rate: 0.6,
      pitch: 1.0,
    });
  } catch {}
}
