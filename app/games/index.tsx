import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import PressableScale from "../../components/PressableScale";
import { useLocale } from "../../lib/locale";
import { COLORS, getLocaleColors } from "../../lib/colors";
import { Ionicons } from "@expo/vector-icons";

const GAMES = [
  {
    id: "pop-the-letter",
    title: "Pop the Letter",
    subtitle: "Pop bubbles to find the right letter!",
    icon: "water" as const,
    color: "#7C4DFF",
    bg: "#F3EDFF",
    route: "/games/pop-the-letter" as const,
  },
  {
    id: "letter-tracing",
    title: "Letter Tracing",
    subtitle: "Draw letters with your finger!",
    icon: "pencil" as const,
    color: "#FF6D00",
    bg: "#FFF3E0",
    route: "/games/letter-tracing" as const,
  },
  {
    id: "letter-world",
    title: "Letter World",
    subtitle: "Match objects to letters!",
    icon: "home" as const,
    color: "#00897B",
    bg: "#E0F2F1",
    route: "/games/letter-world" as const,
  },
];

export default function GamesPickerScreen() {
  const router = useRouter();
  const { locale } = useLocale();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.warmWhite }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
        <Text style={styles.title}>Play Games</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cards}>
        {GAMES.map((game, i) => (
          <Animated.View
            key={game.id}
            entering={FadeInDown.delay(100 + i * 120).springify()}
          >
            <PressableScale onPress={() => router.push(game.route)}>
              <View style={[styles.card, { backgroundColor: game.bg, borderColor: game.color }]}>
                <View style={[styles.iconCircle, { backgroundColor: game.color }]}>
                  <Ionicons name={game.icon} size={32} color="white" />
                </View>
                <Text style={[styles.cardTitle, { color: game.color }]}>{game.title}</Text>
                <Text style={styles.cardSub}>{game.subtitle}</Text>
              </View>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.brown[800] },
  cards: { gap: 16 },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  cardSub: { fontSize: 14, color: COLORS.brown[400], textAlign: "center" },
});
