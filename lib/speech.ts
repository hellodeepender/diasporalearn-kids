import * as Speech from "expo-speech";
import type { Locale } from "./colors";

// Try multiple language codes — devices vary in what they support
const LANGUAGE_CODES: Record<string, string[]> = {
  hy: ["hy-AM", "hy"],
  el: ["el-GR", "el"],
  ar: ["ar", "ar-SA", "ar-LB"],
};

let availableLanguage: Record<string, string | null> = {};
let checked = false;

export async function initSpeech() {
  if (checked) return;
  checked = true;

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const voiceLangs = voices.map((v) => v.language);

    for (const [locale, codes] of Object.entries(LANGUAGE_CODES)) {
      for (const code of codes) {
        if (voiceLangs.some((vl) => vl.startsWith(code.split("-")[0]))) {
          availableLanguage[locale] = code;
          break;
        }
      }
      if (!availableLanguage[locale]) {
        availableLanguage[locale] = null;
      }
    }
  } catch {
    // Can't check voices — will try anyway
  }
}

export function speakLetter(text: string, locale: Locale) {
  try {
    const lang =
      availableLanguage[locale] ?? LANGUAGE_CODES[locale]?.[0] ?? "en-US";
    if (availableLanguage[locale] === null && checked) return;

    Speech.stop();
    Speech.speak(text, {
      language: lang,
      rate: 0.7,
      pitch: 1.1,
    });
  } catch {
    // fail silently
  }
}

export function speakWord(word: string, locale: Locale) {
  try {
    const lang =
      availableLanguage[locale] ?? LANGUAGE_CODES[locale]?.[0] ?? "en-US";
    if (availableLanguage[locale] === null && checked) return;

    Speech.stop();
    Speech.speak(word, {
      language: lang,
      rate: 0.6,
      pitch: 1.0,
    });
  } catch {
    // fail silently
  }
}
