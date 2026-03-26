import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors, type Locale } from "../../lib/colors";
import { getAlphabet, type LetterData } from "../../lib/alphabet-data";
import MascotImage from "../../components/MascotImage";
import PressableScale from "../../components/PressableScale";
import { playSound } from "../../lib/sounds";
import { speakLetter } from "../../lib/speech";
import { Ionicons } from "@expo/vector-icons";

const TOTAL_ROUNDS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(correct: LetterData, allLetters: LetterData[]): LetterData[] {
  const others = allLetters.filter((l) => l.letter !== correct.letter);
  const shuffled = shuffle(others);
  const distractors = shuffled.slice(0, Math.min(3, shuffled.length));
  return shuffle([correct, ...distractors]);
}

export default function LetterQuizScreen() {
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
    if (currentLetter && phase === "playing") {
      speakLetter(currentLetter.letter, locale);
    }
  }, [round, phase]);

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
        <MascotImage locale={locale} pose="celebrating" size={120} />
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
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
        <Text style={styles.roundText}>
          {round + 1} / {rounds.length}
        </Text>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      <View style={styles.letterSection}>
        <Text style={styles.bigEmoji}>{currentLetter.emoji}</Text>
        <Text style={[styles.bigLetter, { color: colors.primary }]}>
          {currentLetter.letter}
        </Text>
        <Text style={styles.question}>What is this letter called?</Text>
      </View>

      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = selected === opt.letter;
          const isCorrect = opt.letter === currentLetter.letter;
          let bgColor: string = colors.bg;
          let borderColor: string = colors.primaryLight;
          let textColor: string = COLORS.brown[800];

          if (selected !== null) {
            if (isCorrect) {
              bgColor = "#D4EDDA";
              borderColor = "#28A745";
              textColor = "#155724";
            } else if (isSelected && !isCorrect) {
              bgColor = "#F8D7DA";
              borderColor = "#DC3545";
              textColor = "#721C24";
            } else {
              bgColor = COLORS.brown[50];
              borderColor = COLORS.brown[100];
              textColor = COLORS.brown[300];
            }
          }

          return (
            <Pressable
              key={opt.letter}
              onPress={() => handleAnswer(opt)}
              disabled={selected !== null}
              style={[
                styles.optionBtn,
                { backgroundColor: bgColor, borderColor: borderColor },
              ]}
            >
              <Text style={[styles.optionText, { color: textColor }]}>
                {opt.name}
              </Text>
              {selected !== null && isCorrect && (
                <Text style={styles.checkmark}>✓</Text>
              )}
              {selected !== null && isSelected && !isCorrect && (
                <Text style={styles.xmark}>✗</Text>
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
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  roundText: { fontSize: 16, fontWeight: "600", color: COLORS.brown[500] },
  scoreText: { fontSize: 16, fontWeight: "600", color: COLORS.gold },
  letterSection: { alignItems: "center", marginVertical: 24 },
  bigEmoji: { fontSize: 48, marginBottom: 8 },
  bigLetter: { fontSize: 80, fontWeight: "700", lineHeight: 90 },
  question: { fontSize: 18, color: COLORS.brown[500], marginTop: 8 },
  optionsGrid: { gap: 12 },
  optionBtn: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 20, fontWeight: "600" },
  checkmark: { fontSize: 24, color: "#28A745" },
  xmark: { fontSize: 24, color: "#DC3545" },
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
    color: COLORS.brown[500],
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
  backText: { color: COLORS.brown[400], fontSize: 14, marginTop: 8 },
});
