import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useLocale } from "../../lib/locale";
import { COLORS } from "../../lib/colors";
import MascotImage from "../../components/MascotImage";
import PressableScale from "../../components/PressableScale";
import HomeBar from "../../components/HomeBar";
import { Ionicons } from "@expo/vector-icons";

const GAMES = [
  {
    id: "letter-quiz",
    title: "Letter Quiz",
    subtitle: "Name the letter!",
    emoji: "🎯",
    route: "/games/letter-quiz" as const,
    color: "#E74C3C",
    bg: "#FFF0F0",
  },
  {
    id: "match-picture",
    title: "Match the Picture",
    subtitle: "Find the starting letter!",
    emoji: "🖼️",
    route: "/games/match-picture" as const,
    color: "#3498DB",
    bg: "#F0F6FF",
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    subtitle: "Match letter pairs!",
    emoji: "🃏",
    route: "/games/memory-cards" as const,
    color: "#2ECC71",
    bg: "#F0FFF4",
  },
];

export default function GamePicker() {
  const { locale } = useLocale();
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  if (!locale) {
    router.replace("/");
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: COLORS.warmWhite }]}
      contentContainerStyle={styles.content}
    >
      <HomeBar />

      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
        </PressableScale>
      </View>

      <View style={styles.titleSection}>
        <MascotImage locale={locale} pose="celebrating" size={100} />
        <Text style={styles.title}>Play Games</Text>
        <Text style={styles.subtitle}>Choose a game to play!</Text>
      </View>

      <View style={styles.games}>
        {GAMES.map((game) => (
          <PressableScale key={game.id} onPress={() => router.push(game.route)}>
            <View
              style={[
                styles.gameCard,
                { backgroundColor: game.bg, borderColor: game.color },
              ]}
            >
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
              <View style={styles.gameText}>
                <Text style={[styles.gameTitle, { color: game.color }]}>
                  {game.title}
                </Text>
                <Text style={styles.gameSub}>{game.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={COLORS.brown[400]}
              />
            </View>
          </PressableScale>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 44, paddingBottom: 40 },
  header: { marginBottom: 8, paddingHorizontal: 20 },
  titleSection: { alignItems: "center", marginBottom: 28 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.brown[800],
    marginTop: 12,
  },
  subtitle: { fontSize: 16, color: COLORS.brown[500], marginTop: 4 },
  games: { gap: 14, paddingHorizontal: 20 },
  gameCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  gameEmoji: { fontSize: 36 },
  gameText: { flex: 1 },
  gameTitle: { fontSize: 20, fontWeight: "700" },
  gameSub: { fontSize: 13, color: COLORS.brown[500], marginTop: 2 },
});
