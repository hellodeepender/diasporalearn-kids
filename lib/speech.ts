import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import type { Locale } from "./colors";
import { HY_LETTER_AUDIO, HY_WORD_AUDIO } from "./armenian-audio";
import { SYR_LETTER_AUDIO, SYR_WORD_AUDIO } from "./syriac-audio";
import { getAlphabet } from "./alphabet-data";

const LANGUAGE_MAP: Record<string, string> = {
  hy: "hy-AM",
  el: "el-GR",
  ar: "ar",
};

// Cache letter→index lookups for bundled-audio locales
let hyLetterIndex: Map<string, number> | null = null;
let hyWordIndex: Map<string, number> | null = null;
let syrLetterIndex: Map<string, number> | null = null;
let syrWordIndex: Map<string, number> | null = null;

function getLetterIndex(locale: "hy" | "syr"): Map<string, number> {
  if (locale === "hy") {
    if (!hyLetterIndex) {
      hyLetterIndex = new Map();
      getAlphabet("hy").forEach((item, i) => {
        hyLetterIndex!.set(item.letter, i);
        hyLetterIndex!.set(item.letterLower, i);
      });
    }
    return hyLetterIndex;
  }
  if (!syrLetterIndex) {
    syrLetterIndex = new Map();
    getAlphabet("syr").forEach((item, i) => {
      syrLetterIndex!.set(item.letter, i);
      syrLetterIndex!.set(item.letterLower, i);
    });
  }
  return syrLetterIndex;
}

function getWordIndex(locale: "hy" | "syr"): Map<string, number> {
  if (locale === "hy") {
    if (!hyWordIndex) {
      hyWordIndex = new Map();
      getAlphabet("hy").forEach((item, i) => {
        hyWordIndex!.set(item.exampleWord, i);
      });
    }
    return hyWordIndex;
  }
  if (!syrWordIndex) {
    syrWordIndex = new Map();
    getAlphabet("syr").forEach((item, i) => {
      syrWordIndex!.set(item.exampleWord, i);
    });
  }
  return syrWordIndex;
}

const LETTER_AUDIO = { hy: HY_LETTER_AUDIO, syr: SYR_LETTER_AUDIO };
const WORD_AUDIO = { hy: HY_WORD_AUDIO, syr: SYR_WORD_AUDIO };

let currentSound: Audio.Sound | null = null;

async function playBundledAudio(source: ReturnType<typeof require>) {
  try {
    if (currentSound) {
      await currentSound.stopAsync().catch(() => {});
      await currentSound.unloadAsync().catch(() => {});
      currentSound = null;
    }
    const { sound } = await Audio.Sound.createAsync(source);
    currentSound = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
      }
    });
  } catch {}
}

export async function initSpeech() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  } catch {}
}

export function speakLetter(text: string, locale: Locale) {
  if (locale === "hy" || locale === "syr") {
    const idx = getLetterIndex(locale).get(text);
    if (idx !== undefined && LETTER_AUDIO[locale][idx]) {
      playBundledAudio(LETTER_AUDIO[locale][idx]);
      return;
    }
    // No matching bundled audio — fail silently for these locales
    return;
  }

  // Greek, Arabic — use expo-speech
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
  if (locale === "hy" || locale === "syr") {
    const idx = getWordIndex(locale).get(word);
    if (idx !== undefined && WORD_AUDIO[locale][idx]) {
      playBundledAudio(WORD_AUDIO[locale][idx]);
      return;
    }
    return;
  }

  // Greek, Arabic — use expo-speech
  try {
    Speech.stop();
    Speech.speak(word, {
      language: LANGUAGE_MAP[locale] ?? "en-US",
      rate: 0.6,
      pitch: 1.0,
    });
  } catch {}
}
