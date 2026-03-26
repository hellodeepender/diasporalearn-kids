import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import {
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import PressableScale from "../../components/PressableScale";
import MascotImage from "../../components/MascotImage";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors } from "../../lib/colors";
import { getAlphabet, type LetterData } from "../../lib/alphabet-data";
import { Ionicons } from "@expo/vector-icons";
import { speakLetter } from "../../lib/speech";
import { playSound } from "../../lib/sounds";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_SIZE = SCREEN_WIDTH - 64;
const LETTERS_PER_SESSION = 10;
const COMPLETION_THRESHOLD = 200;

function TracingCanvas({
  letter,
  colors,
  onComplete,
}: {
  letter: LetterData;
  colors: ReturnType<typeof getLocaleColors>;
  onComplete: () => void;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [completed, setCompleted] = useState(false);

  // Use refs for values mutated during gesture to avoid stale closures
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const totalDistRef = useRef(0);
  const completedRef = useRef(false);
  const currentPathRef = useRef("");

  const isValidCoord = (v: number) =>
    typeof v === "number" && !isNaN(v) && isFinite(v);

  const handleComplete = useCallback(() => {
    setCompleted(true);
    completedRef.current = true;
    playSound("correct");
    onComplete();
  }, [onComplete]);

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      if (!isValidCoord(e.x) || !isValidCoord(e.y)) return;
      const path = `M ${e.x} ${e.y}`;
      currentPathRef.current = path;
      setCurrentPath(path);
      lastPointRef.current = { x: e.x, y: e.y };
    })
    .onUpdate((e) => {
      if (!isValidCoord(e.x) || !isValidCoord(e.y)) return;
      const updated = currentPathRef.current + ` L ${e.x} ${e.y}`;
      currentPathRef.current = updated;
      setCurrentPath(updated);

      const last = lastPointRef.current;
      if (last) {
        const dx = e.x - last.x;
        const dy = e.y - last.y;
        totalDistRef.current += Math.sqrt(dx * dx + dy * dy);
        if (totalDistRef.current > COMPLETION_THRESHOLD && !completedRef.current) {
          handleComplete();
        }
      }
      lastPointRef.current = { x: e.x, y: e.y };
    })
    .onEnd(() => {
      const path = currentPathRef.current;
      if (path) {
        setPaths((prev) => [...prev, path]);
      }
      currentPathRef.current = "";
      setCurrentPath("");
      lastPointRef.current = null;
    });

  const clearCanvas = () => {
    playSound("tap");
    setPaths([]);
    setCurrentPath("");
    currentPathRef.current = "";
    totalDistRef.current = 0;
    completedRef.current = false;
    setCompleted(false);
    lastPointRef.current = null;
  };

  return (
    <View>
      <View style={[styles.canvas, { borderColor: colors.primaryLight }]}>
        {/* Ghost letter */}
        <Text style={[styles.ghostLetter, { color: colors.primaryLight }]}>
          {letter.letter}
        </Text>

        {/* Drawing surface */}
        <GestureDetector gesture={panGesture}>
          <View style={StyleSheet.absoluteFill}>
            <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={StyleSheet.absoluteFill}>
              {paths.map((d, i) => (
                <Path
                  key={i}
                  d={d}
                  stroke={colors.primary}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke={colors.primary}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Svg>
          </View>
        </GestureDetector>

        {/* Completion checkmark */}
        {completed && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.checkOverlay}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </Animated.View>
        )}
      </View>

      <PressableScale onPress={clearCanvas}>
        <View style={[styles.clearBtn, { borderColor: colors.primaryLight }]}>
          <Ionicons name="refresh" size={20} color={colors.primary} />
          <Text style={[styles.clearBtnText, { color: colors.primary }]}>Clear</Text>
        </View>
      </PressableScale>
    </View>
  );
}

function ScoreScreen({
  completed,
  total,
  locale,
  onPlayAgain,
  onBack,
}: {
  completed: number;
  total: number;
  locale: "hy" | "el" | "ar";
  onPlayAgain: () => void;
  onBack: () => void;
}) {
  const colors = getLocaleColors(locale);
  const stars = completed >= total ? 3 : completed >= total * 0.7 ? 2 : 1;

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.scoreContainer}>
      <MascotImage locale={locale} pose="celebrating" size={120} />
      <Text style={styles.scoreTitle}>Amazing Tracing!</Text>
      <Text style={styles.scoreValue}>
        {completed} / {total} letters
      </Text>
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
        <View style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.actionBtnText}>Play Again</Text>
        </View>
      </PressableScale>
      <PressableScale onPress={onBack}>
        <Text style={styles.backLink}>Back to Games</Text>
      </PressableScale>
    </Animated.View>
  );
}

export default function LetterTracingScreen() {
  const router = useRouter();
  const { locale } = useLocale();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);
  const sessionLetters = alphabet.slice(0, LETTERS_PER_SESSION);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [letterDone, setLetterDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentLetter = sessionLetters[currentIndex];

  useEffect(() => {
    if (currentLetter) {
      speakLetter(currentLetter.letter, locale);
    }
  }, [currentIndex]);

  const handleLetterComplete = useCallback(() => {
    setLetterDone(true);
    setCompletedCount((c) => c + 1);
  }, []);

  const handleNext = () => {
    if (currentIndex + 1 >= sessionLetters.length) {
      setGameOver(true);
      playSound("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setLetterDone(false);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setCompletedCount(0);
    setLetterDone(false);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
        <ScoreScreen
          completed={completedCount}
          total={sessionLetters.length}
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
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Letter Tracing</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Letter info */}
      <View style={styles.letterInfo}>
        <Text style={styles.traceLabel}>Trace:</Text>
        <Text style={[styles.letterDisplay, { color: colors.primary }]}>
          {currentLetter.letter}
        </Text>
        <Text style={styles.letterMeta}>
          {currentLetter.name} — "{currentLetter.sound}"
        </Text>
      </View>

      {/* Canvas */}
      <View style={styles.canvasWrapper}>
        <TracingCanvas
          key={currentIndex}
          letter={currentLetter}
          colors={colors}
          onComplete={handleLetterComplete}
        />
      </View>

      {/* Next button */}
      <View style={styles.bottomBar}>
        <PressableScale
          onPress={handleNext}
          style={{ opacity: letterDone ? 1 : 0.4 }}
          disabled={!letterDone}
        >
          <View style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.actionBtnText}>
              {currentIndex + 1 >= sessionLetters.length ? "Finish" : "Next"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </PressableScale>
      </View>

      {/* Progress dots */}
      <View style={styles.progressDots}>
        {sessionLetters.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i < currentIndex
                    ? colors.primary
                    : i === currentIndex
                    ? colors.primaryLight
                    : COLORS.brown[100],
              },
            ]}
          />
        ))}
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
    marginBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  letterInfo: { alignItems: "center", marginBottom: 12 },
  traceLabel: { fontSize: 14, color: COLORS.brown[400] },
  letterDisplay: { fontSize: 48, fontWeight: "700" },
  letterMeta: { fontSize: 14, color: COLORS.brown[300], marginTop: 2 },
  canvasWrapper: { alignItems: "center", paddingHorizontal: 32 },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostLetter: {
    fontSize: 220,
    fontWeight: "700",
    position: "absolute",
  },
  checkOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    width: "100%",
    height: "100%",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    alignSelf: "center",
  },
  clearBtnText: { fontSize: 14, fontWeight: "600" },
  bottomBar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  actionBtnText: { fontSize: 18, fontWeight: "700", color: "white" },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingBottom: 30,
  },
  progressDot: { width: 8, height: 8, borderRadius: 4 },
  // Score
  scoreContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  scoreTitle: { fontSize: 32, fontWeight: "700", color: COLORS.brown[800], marginTop: 16 },
  scoreValue: { fontSize: 24, color: COLORS.brown[500], marginTop: 8, marginBottom: 16 },
  starsRow: { flexDirection: "row", gap: 8, marginBottom: 32 },
  backLink: {
    fontSize: 16,
    color: COLORS.brown[400],
    textDecorationLine: "underline",
    marginTop: 16,
  },
});
