import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors, type Locale } from "../../lib/colors";
import { getAlphabet, type LetterData } from "../../lib/alphabet-data";
import MascotImage from "../../components/MascotImage";
import MascotWithBubble from "../../components/MascotWithBubble";
import PressableScale from "../../components/PressableScale";
import HomeBar from "../../components/HomeBar";
import { playSound } from "../../lib/sounds";
import { speakWord } from "../../lib/speech";
import { recordGameComplete } from "../../lib/progress";
import { Ionicons } from "@expo/vector-icons";
import { getFontFamily } from "../../lib/fonts";

const TOTAL_ROUNDS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(
  correct: LetterData,
  allLetters: LetterData[]
): LetterData[] {
  const others = allLetters.filter((l) => l.letter !== correct.letter);
  const shuffled = shuffle(others);
  const distractors = shuffled.slice(0, Math.min(3, shuffled.length));
  return shuffle([correct, ...distractors]);
}

export default function MatchPictureScreen() {
  const { locale } = useLocale();
  const router = useRouter();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [phase, setPhase] = useState<"playing" | "complete">("playing");

  const [rounds] = useState(() => {
    const shuffled = shuffle([...alphabet]);
    return shuffled.slice(0, Math.min(TOTAL_ROUNDS, shuffled.length));
  });

  const currentLetter = round < rounds.length ? rounds[round] : null;
  const [options, setOptions] = useState<LetterData[]>(() =>
    currentLetter ? pickOptions(currentLetter, alphabet) : []
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (currentLetter && phase === "playing") {
      speakWord(currentLetter.exampleWord, locale);
    }
  }, [round, phase]);

  useEffect(() => {
    if (phase === "complete") {
      recordGameComplete(locale, score, rounds.length);
    }
  }, [phase]);

  useEffect(() => {
    const letter = round < rounds.length ? rounds[round] : null;
    if (letter) {
      setOptions(pickOptions(letter, alphabet));
      setSelected(null);
      setShowNext(false);
    }
  }, [round]);

  const handleAnswer = useCallback(
    (option: LetterData) => {
      if (selected !== null || !currentLetter) return;
      setSelected(option.letter);

      if (option.letter === currentLetter.letter) {
        playSound("correct");
        setScore((s) => s + 1);
      } else {
        playSound("wrong");
      }

      setTimeout(() => setShowNext(true), 800);
    },
    [selected, currentLetter]
  );

  const handleNext = useCallback(() => {
    if (round + 1 >= rounds.length) {
      playSound("complete");
      setPhase("complete");
    } else {
      setRound((r) => r + 1);
    }
  }, [round, rounds.length]);

  if (phase === "complete") {
    const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;
    return (
      <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
        <HomeBar />
        <MascotImage locale={locale} pose={score >= 5 ? "celebrating" : "sad"} size={120} />
        <View style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <Text
              key={s}
              style={[styles.star, { opacity: s <= stars ? 1 : 0.2 }]}
            >
              ⭐
            </Text>
          ))}
        </View>
        <Text style={styles.completeTitle}>Great job!</Text>
        <Text style={styles.completeScore}>
          {score} / {rounds.length} correct
        </Text>
        <PressableScale
          onPress={() => {
            setRound(0);
            setScore(0);
            setPhase("playing");
            setSelected(null);
            setShowNext(false);
          }}
          style={[styles.playAgainBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.playAgainText}>Play Again</Text>
        </PressableScale>
        <PressableScale onPress={() => router.back()}>
          <Text style={styles.backText}>Back to Games</Text>
        </PressableScale>
      </View>
    );
  }

  if (!currentLetter) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
        <Text>No letters available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
      <HomeBar />

      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
        <Text style={styles.roundText}>
          {round + 1} / {rounds.length}
        </Text>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      <View style={styles.questionSection}>
        <Text style={styles.bigEmoji}>{currentLetter.emoji}</Text>
        <Text style={[styles.targetWord, { color: colors.primary, fontFamily: getFontFamily(locale) }]}>
          {currentLetter.exampleWord}
        </Text>
        <Text style={styles.targetWordEn}>({currentLetter.exampleWordEn})</Text>
      </View>

      <MascotWithBubble
        locale={locale}
        pose="thinking"
        size={56}
        message="Which letter does this start with?"
      />

      <View style={styles.letterGrid}>
        {options.map((opt) => {
          const isSelected = selected === opt.letter;
          const isCorrect = opt.letter === currentLetter.letter;
          let bgColor = "white";
          let borderColor = colors.primaryLight;

          if (selected !== null) {
            if (isCorrect) {
              bgColor = "#D4EDDA";
              borderColor = "#28A745";
            } else if (isSelected && !isCorrect) {
              bgColor = "#F8D7DA";
              borderColor = "#DC3545";
            } else {
              bgColor = COLORS.brown[50];
              borderColor = COLORS.brown[100];
            }
          }

          return (
            <Pressable
              key={opt.letter}
              onPress={() => handleAnswer(opt)}
              disabled={selected !== null}
              style={[
                styles.letterCard,
                { backgroundColor: bgColor, borderColor },
              ]}
            >
              <Text style={[
                styles.letterCardText,
                { color: selected !== null && !isCorrect && !isSelected ? COLORS.brown[400] : colors.primary, fontFamily: getFontFamily(locale) }
              ]}>
                {opt.letter}
              </Text>
              <Text style={[
                styles.letterCardSub,
                { color: selected !== null && !isCorrect && !isSelected ? COLORS.brown[300] : COLORS.brown[500] }
              ]}>
                {opt.letterLower}
              </Text>
              {selected !== null && isCorrect && (
                <Text style={{ position: "absolute", top: 8, right: 12, fontSize: 20, color: "#28A745" }}>✓</Text>
              )}
              {selected !== null && isSelected && !isCorrect && (
                <Text style={{ position: "absolute", top: 8, right: 12, fontSize: 20, color: "#DC3545" }}>✗</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {showNext && (
        <PressableScale
          onPress={handleNext}
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.nextText}>
            {round + 1 >= rounds.length ? "See Results" : "Next"}
          </Text>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 44, paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roundText: { fontSize: 16, fontWeight: "600", color: COLORS.brown[600] },
  scoreText: { fontSize: 16, fontWeight: "600", color: COLORS.brown[600] },
  questionSection: { alignItems: "center", marginBottom: 20 },
  bigEmoji: { fontSize: 64, marginBottom: 8 },
  targetWord: { fontSize: 28, fontWeight: "700" },
  targetWordEn: { fontSize: 16, color: COLORS.brown[500], marginTop: 2 },
  letterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  letterCard: {
    width: "46%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  letterCardText: {
    fontSize: 48,
    fontWeight: "700",
  },
  letterCardSub: {
    fontSize: 28,
    marginTop: 4,
  },
  nextBtn: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextText: { color: "white", fontSize: 18, fontWeight: "700" },
  starsRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  star: { fontSize: 40 },
  completeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.brown[800],
    marginTop: 12,
  },
  completeScore: {
    fontSize: 16,
    color: COLORS.brown[600],
    marginTop: 4,
    marginBottom: 24,
  },
  playAgainBtn: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 12,
  },
  playAgainText: { color: "white", fontSize: 18, fontWeight: "700" },
  backText: { color: COLORS.brown[500], fontSize: 14, marginTop: 8 },
});
