import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import type { Locale } from "./colors";
import { HY_LETTER_AUDIO, HY_WORD_AUDIO } from "./armenian-audio";
import { getAlphabet } from "./alphabet-data";

const LANGUAGE_MAP: Record<string, string> = {
  hy: "hy-AM",
  el: "el-GR",
  ar: "ar",
};

// Cache letter→index lookup for Armenian
let hyLetterIndex: Map<string, number> | null = null;
let hyWordIndex: Map<string, number> | null = null;

function getHyLetterIndex(): Map<string, number> {
  if (!hyLetterIndex) {
    hyLetterIndex = new Map();
    const alphabet = getAlphabet("hy");
    alphabet.forEach((item, i) => {
      hyLetterIndex!.set(item.letter, i);
      hyLetterIndex!.set(item.letterLower, i);
    });
  }
  return hyLetterIndex;
}

function getHyWordIndex(): Map<string, number> {
  if (!hyWordIndex) {
    hyWordIndex = new Map();
    const alphabet = getAlphabet("hy");
    alphabet.forEach((item, i) => {
      hyWordIndex!.set(item.exampleWord, i);
    });
  }
  return hyWordIndex;
}

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
    // Clean up when done
    sound.setOnPlaybackStatusUpdate((status) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
      }
    });
  } catch {}
}

export async function initSpeech() {
  // Pre-configure audio mode for playback
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  } catch {}
}

export function speakLetter(text: string, locale: Locale) {
  // Syriac has no TTS or bundled audio yet — fail silently
  if (locale === "syr") return;

  if (locale === "hy") {
    const idx = getHyLetterIndex().get(text);
    if (idx !== undefined && HY_LETTER_AUDIO[idx]) {
      playBundledAudio(HY_LETTER_AUDIO[idx]);
      return;
    }
  }

  // Greek, Arabic, or fallback
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
  if (locale === "syr") return;

  if (locale === "hy") {
    const idx = getHyWordIndex().get(word);
    if (idx !== undefined && HY_WORD_AUDIO[idx]) {
      playBundledAudio(HY_WORD_AUDIO[idx]);
      return;
    }
  }

  // Greek, Arabic, or fallback
  try {
    Speech.stop();
    Speech.speak(word, {
      language: LANGUAGE_MAP[locale] ?? "en-US",
      rate: 0.6,
      pitch: 1.0,
    });
  } catch {}
}
