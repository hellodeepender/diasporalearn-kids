import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import PressableScale from "../../components/PressableScale";
import MascotImage from "../../components/MascotImage";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors } from "../../lib/colors";
import { getAlphabet, type LetterData } from "../../lib/alphabet-data";
import { Ionicons } from "@expo/vector-icons";
import { speakLetter } from "../../lib/speech";
import { playSound } from "../../lib/sounds";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const TOTAL_ROUNDS = 10;
const BUBBLE_COLORS = ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#E8BAFF", "#FFD9BA"];
const BUBBLE_RISE_DURATION = 5000;

interface BubbleData {
  id: string;
  letter: LetterData;
  x: number;
  size: number;
  colorIndex: number;
  isCorrect: boolean;
}

function Bubble({
  data,
  onPop,
}: {
  data: BubbleData;
  onPop: (id: string, correct: boolean) => void;
}) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const bgColor = useSharedValue(BUBBLE_COLORS[data.colorIndex]);
  const popped = useRef(false);

  useEffect(() => {
    // Rise from bottom to above screen
    translateY.value = withTiming(-data.size - 20, {
      duration: BUBBLE_RISE_DURATION,
      easing: Easing.linear,
    }, (finished) => {
      if (finished && !popped.current) {
        runOnJS(onPop)(data.id, false);
      }
    });

    // Gentle wobble
    translateX.value = withDelay(
      Math.random() * 500,
      withSequence(
        withTiming(-12, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(-12, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (popped.current) return;
    popped.current = true;

    if (data.isCorrect) {
      // Pop: scale up and fade out
      scale.value = withSpring(1.5, { damping: 10, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 400 });
    } else {
      // Shake and turn red
      bgColor.value = "#FF6B6B";
      translateX.value = withSequence(
        withTiming(-15, { duration: 60 }),
        withTiming(15, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      scale.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
      opacity.value = withDelay(300, withTiming(0, { duration: 200 }));
    }

    setTimeout(() => onPop(data.id, data.isCorrect), 500);
  };

  const bubbleBgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bubbleOuter,
        { left: data.x, width: data.size, height: data.size },
        animStyle,
      ]}
    >
      <Pressable onPress={handlePress} style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.bubble,
            {
              width: data.size,
              height: data.size,
              borderRadius: data.size / 2,
              borderColor: BUBBLE_COLORS[data.colorIndex] + "88",
            },
            bubbleBgStyle,
          ]}
        >
          <Text style={[styles.bubbleLetter, { fontSize: data.size * 0.38 }]}>
            {data.letter.letter}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function ConfettiPiece({ targetX, targetY, color }: { targetX: number; targetY: number; color: string }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const op = useSharedValue(1);

  useEffect(() => {
    tx.value = withTiming(targetX, { duration: 600 });
    ty.value = withTiming(targetY, { duration: 600 });
    op.value = withDelay(300, withTiming(0, { duration: 300 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: color },
        style,
      ]}
    />
  );
}

const CONFETTI_PIECES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = 80;
  return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, color: BUBBLE_COLORS[i % BUBBLE_COLORS.length] };
});

function ConfettiBurst() {
  return (
    <View style={styles.confettiContainer}>
      {CONFETTI_PIECES.map((p) => (
        <ConfettiPiece key={p.id} targetX={p.x} targetY={p.y} color={p.color} />
      ))}
    </View>
  );
}

function ScoreScreen({
  score,
  locale,
  onPlayAgain,
  onBack,
}: {
  score: number;
  locale: "hy" | "el" | "ar";
  onPlayAgain: () => void;
  onBack: () => void;
}) {
  const colors = getLocaleColors(locale);
  const stars = score >= 10 ? 3 : score >= 7 ? 2 : 1;

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.scoreContainer}>
      <MascotImage locale={locale} pose="celebrating" size={120} />
      <Text style={styles.scoreTitle}>Great Job!</Text>
      <Text style={styles.scoreValue}>{score} / {TOTAL_ROUNDS}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3].map((s) => (
          <Ionicons
            key={s}
            name={s <= stars ? "star" : "star-outline"}
            size={44}
            color={s <= stars ? COLORS.gold : COLORS.brown[200]}
          />
        ))}
      </View>
      <PressableScale onPress={onPlayAgain}>
        <View style={[styles.scoreBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.scoreBtnText}>Play Again</Text>
        </View>
      </PressableScale>
      <PressableScale onPress={onBack}>
        <Text style={styles.backLink}>Back to Games</Text>
      </PressableScale>
    </Animated.View>
  );
}

export default function PopTheLetterScreen() {
  const router = useRouter();
  const { locale } = useLocale();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);

  if (!alphabet || alphabet.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.warmWhite, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: COLORS.brown[500], fontSize: 16 }}>No letters available</Text>
      </View>
    );
  }

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [targetLetter, setTargetLetter] = useState<LetterData | null>(null);
  const roundRef = useRef(0);

  const startRound = useCallback(() => {
    const currentRound = roundRef.current;
    if (currentRound >= TOTAL_ROUNDS) {
      setGameOver(true);
      playSound("complete");
      return;
    }

    // Pick target and distractors
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const distractors = shuffled.slice(1, 4 + Math.floor(Math.random() * 2)); // 3-5 distractors
    const allLetters = [target, ...distractors].sort(() => Math.random() - 0.5);

    const bubbleSize = 70 + Math.floor(Math.random() * 20);
    const maxX = SCREEN_WIDTH - bubbleSize - 20;

    const newBubbles: BubbleData[] = allLetters.map((letter, i) => ({
      id: `${currentRound}-${i}`,
      letter,
      x: 20 + Math.random() * (maxX - 20),
      size: bubbleSize + Math.floor(Math.random() * 16 - 8),
      colorIndex: i % BUBBLE_COLORS.length,
      isCorrect: letter === target,
    }));

    setTargetLetter(target);
    setBubbles(newBubbles);
  }, [alphabet]);

  useEffect(() => {
    startRound();
  }, []);

  useEffect(() => {
    if (targetLetter) {
      speakLetter(targetLetter.letter, locale);
    }
  }, [targetLetter]);

  const handleBubblePop = useCallback(
    (id: string, correct: boolean) => {
      playSound("tap");
      if (correct) {
        playSound("correct");
        setScore((s) => s + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 700);
        // Next round after a delay
        setTimeout(() => {
          roundRef.current += 1;
          setRound((r) => r + 1);
          setBubbles([]);
          startRound();
        }, 1000);
      } else {
        playSound("wrong");
        // Remove the wrong bubble
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }
    },
    [startRound]
  );

  const resetGame = () => {
    roundRef.current = 0;
    setRound(0);
    setScore(0);
    setGameOver(false);
    setShowConfetti(false);
    setBubbles([]);
    startRound();
  };

  if (gameOver) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
        <ScoreScreen
          score={score}
          locale={locale}
          onPlayAgain={resetGame}
          onBack={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
      {/* Header */}
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
        <Text style={styles.roundText}>
          {Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
        </Text>
        <View style={styles.scoreChip}>
          <Ionicons name="star" size={16} color={COLORS.gold} />
          <Text style={styles.scoreChipText}>{score}</Text>
        </View>
      </View>

      {/* Target letter prompt */}
      {targetLetter && (
        <View style={styles.prompt}>
          <MascotImage locale={locale} pose="happy" size={56} />
          <View style={[styles.speechBubble, { borderColor: colors.primaryLight }]}>
            <Text style={styles.findText}>Find</Text>
            <Text style={[styles.targetLetter, { color: colors.primary }]}>
              {targetLetter.letter}
            </Text>
          </View>
        </View>
      )}

      {/* Bubble area */}
      <View style={styles.bubbleArea}>
        {bubbles.map((b) => (
          <Bubble key={b.id} data={b} onPop={handleBubblePop} />
        ))}
        {showConfetti && <ConfettiBurst />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  roundText: { fontSize: 16, fontWeight: "600", color: COLORS.brown[500] },
  scoreChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brown[50],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreChipText: { fontSize: 16, fontWeight: "700", color: COLORS.brown[700] },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  speechBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  findText: { fontSize: 18, color: COLORS.brown[500] },
  targetLetter: { fontSize: 36, fontWeight: "700" },
  bubbleArea: {
    flex: 1,
    overflow: "hidden",
  },
  bubbleOuter: {
    position: "absolute",
    bottom: 0,
  },
  bubble: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  bubbleLetter: { fontWeight: "700", color: COLORS.brown[700] },
  confettiContainer: {
    position: "absolute",
    top: "40%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  // Score screen
  scoreContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  scoreTitle: { fontSize: 32, fontWeight: "700", color: COLORS.brown[800], marginTop: 16 },
  scoreValue: { fontSize: 24, color: COLORS.brown[500], marginTop: 8, marginBottom: 16 },
  starsRow: { flexDirection: "row", gap: 8, marginBottom: 32 },
  scoreBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 16,
  },
  scoreBtnText: { fontSize: 18, fontWeight: "700", color: "white" },
  backLink: {
    fontSize: 16,
    color: COLORS.brown[400],
    textDecorationLine: "underline",
  },
});
