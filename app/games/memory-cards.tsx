import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors } from "../../lib/colors";
import { getAlphabet } from "../../lib/alphabet-data";
import MascotImage from "../../components/MascotImage";
import PressableScale from "../../components/PressableScale";
import { playSound } from "../../lib/sounds";
import { recordGameComplete } from "../../lib/progress";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 8;
const COLS = 3;
const CARD_SIZE = (SCREEN_WIDTH - 40 - CARD_GAP * (COLS - 1)) / COLS;

interface Card {
  id: string;
  pairId: string;
  display: string;
  type: "letter" | "name";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(alphabet: ReturnType<typeof getAlphabet>): Card[] {
  const picked = shuffle([...alphabet]).slice(0, 6);
  const cardPairs: Card[] = [];
  picked.forEach((letter, i) => {
    cardPairs.push({
      id: `letter-${i}`,
      pairId: `pair-${i}`,
      display: letter.letter,
      type: "letter",
    });
    cardPairs.push({
      id: `word-${i}`,
      pairId: `pair-${i}`,
      display: `${letter.emoji} ${letter.exampleWordEn}`,
      type: "name",
    });
  });
  return shuffle(cardPairs);
}

export default function MemoryCardsScreen() {
  const { locale } = useLocale();
  const router = useRouter();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);

  const [cards, setCards] = useState<Card[]>(() => buildCards(alphabet));
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [firstPick, setFirstPick] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState<"playing" | "complete">("playing");

  const allMatched = matched.size === cards.length;

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      playSound("complete");
      setTimeout(() => setPhase("complete"), 500);
    }
  }, [allMatched]);

  useEffect(() => {
    if (phase === "complete") {
      recordGameComplete(locale, 6, moves);
    }
  }, [phase]);

  const handleTap = useCallback(
    (cardId: string) => {
      if (locked) return;
      if (flipped.has(cardId)) return;
      if (matched.has(cardId)) return;

      playSound("tap");

      const newFlipped = new Set(flipped);
      newFlipped.add(cardId);
      setFlipped(newFlipped);

      if (firstPick === null) {
        setFirstPick(cardId);
      } else {
        setMoves((m) => m + 1);
        setLocked(true);

        const firstCard = cards.find((c) => c.id === firstPick);
        const secondCard = cards.find((c) => c.id === cardId);

        if (
          firstCard &&
          secondCard &&
          firstCard.pairId === secondCard.pairId
        ) {
          playSound("correct");
          const newMatched = new Set(matched);
          newMatched.add(firstPick);
          newMatched.add(cardId);
          setMatched(newMatched);
          setFirstPick(null);
          setLocked(false);
        } else {
          playSound("wrong");
          const savedFirstPick = firstPick;
          setTimeout(() => {
            const resetFlipped = new Set(flipped);
            resetFlipped.delete(savedFirstPick);
            resetFlipped.delete(cardId);
            setFlipped(resetFlipped);
            setFirstPick(null);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [firstPick, flipped, matched, locked, cards]
  );

  if (phase === "complete") {
    const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;
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
        <Text style={styles.completeTitle}>You did it!</Text>
        <Text style={styles.completeScore}>
          Matched all pairs in {moves} moves
        </Text>
        <PressableScale
          onPress={() => {
            setCards(buildCards(alphabet));
            setFlipped(new Set());
            setMatched(new Set());
            setFirstPick(null);
            setLocked(false);
            setMoves(0);
            setPhase("playing");
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

  return (
    <View style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
        <Text style={styles.roundText}>Memory Cards</Text>
        <Text style={styles.scoreText}>Moves: {moves}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id) || matched.has(card.id);
          const isMatched = matched.has(card.id);

          return (
            <Pressable
              key={card.id}
              onPress={() => handleTap(card.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isMatched
                    ? "#D4EDDA"
                    : isFlipped
                      ? "white"
                      : colors.primary,
                  borderColor: isMatched
                    ? "#28A745"
                    : isFlipped
                      ? colors.primaryLight
                      : colors.primaryDark,
                },
              ]}
            >
              {isFlipped ? (
                <Text
                  style={[
                    styles.cardText,
                    {
                      color: isMatched ? "#155724" : COLORS.brown[800],
                      fontSize: card.type === "letter" ? 36 : 16,
                    },
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  {card.display}
                </Text>
              ) : (
                <Text style={styles.cardHidden}>?</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>Tap two cards to find matching pairs!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  roundText: { fontSize: 18, fontWeight: "700", color: COLORS.brown[800] },
  scoreText: { fontSize: 14, color: COLORS.brown[500] },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    justifyContent: "center",
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.2,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  cardText: { fontWeight: "600", textAlign: "center" },
  cardHidden: { fontSize: 28, color: "white", fontWeight: "700" },
  hint: {
    textAlign: "center",
    color: COLORS.brown[400],
    fontSize: 14,
    marginTop: 20,
  },
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
