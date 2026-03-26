import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Locale } from "./colors";

export interface ProgressData {
  lettersViewed: string[];
  gamesPlayed: number;
  gamesWon: number;
  totalCorrect: number;
  totalAttempts: number;
  lastPlayed: string | null;
}

const STORAGE_KEY = "progress";

function getKey(locale: Locale) {
  return `${STORAGE_KEY}_${locale}`;
}

const DEFAULT_PROGRESS: ProgressData = {
  lettersViewed: [],
  gamesPlayed: 0,
  gamesWon: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  lastPlayed: null,
};

export async function getProgress(locale: Locale): Promise<ProgressData> {
  try {
    const raw = await AsyncStorage.getItem(getKey(locale));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

async function saveProgress(locale: Locale, data: ProgressData) {
  try {
    await AsyncStorage.setItem(getKey(locale), JSON.stringify(data));
  } catch {}
}

export async function recordLetterViewed(locale: Locale, letter: string) {
  const data = await getProgress(locale);
  if (!data.lettersViewed.includes(letter)) {
    data.lettersViewed.push(letter);
    await saveProgress(locale, data);
  }
}

export async function recordGameComplete(
  locale: Locale,
  correct: number,
  total: number
) {
  const data = await getProgress(locale);
  data.gamesPlayed += 1;
  data.totalCorrect += correct;
  data.totalAttempts += total;
  data.lastPlayed = new Date().toISOString();
  if (total > 0 && correct / total >= 0.7) {
    data.gamesWon += 1;
  }
  await saveProgress(locale, data);
}

export async function resetProgress(locale: Locale) {
  try {
    await AsyncStorage.removeItem(getKey(locale));
  } catch {}
}
