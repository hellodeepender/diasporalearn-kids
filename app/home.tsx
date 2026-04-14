import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import PressableScale from "../components/PressableScale";
import MascotImage from "../components/MascotImage";
import HomeBar from "../components/HomeBar";
import { useLocale } from "../lib/locale";
import { COLORS, getLocaleColors } from "../lib/colors";
import { getMascotName } from "../lib/mascots";
import { getFontFamily } from "../lib/fonts";
import { Ionicons } from "@expo/vector-icons";

const GREETINGS: Record<string, string> = {
  hy: "\u0532\u0561\u0580\u0587",
  el: "\u0393\u03B5\u03B9\u03B1 \u03C3\u03BF\u03C5",
  ar: "\u0645\u0631\u062D\u0628\u0627",
  syr: "\u072B\u0720\u0721\u0710",
};

export default function HomeScreen() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();

  if (!locale) {
    router.replace("/");
    return null;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setLocale(null);
      router.replace("/");
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const colors = getLocaleColors(locale);
  const mascotName = getMascotName(locale);
  const greeting = GREETINGS[locale] ?? "Hello";

  const zones = [
    {
      id: "alphabet",
      title: "Learn Letters",
      subtitle: "Explore the alphabet",
      icon: "text" as const,
      color: colors.primary,
      bg: colors.bg,
      route: "/alphabet" as const,
    },
    {
      id: "games",
      title: "Play Games",
      subtitle: "Fun letter games",
      icon: "game-controller" as const,
      color: COLORS.gold,
      bg: "#FFFBF0",
      route: "/games" as const,
    },
    {
      id: "progress",
      title: "My Progress",
      subtitle: "Badges & streaks",
      icon: "trophy" as const,
      color: "#4CAF50",
      bg: "#F0FFF4",
      route: "/progress" as const,
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.warmWhite }}
      contentContainerStyle={styles.content}
    >
      <HomeBar showHome={false} />

      <Animated.View entering={FadeInUp.springify()} style={styles.greetingSection}>
        <MascotImage locale={locale} pose="happy" size={140} />
        <Text style={[styles.greeting, { fontFamily: getFontFamily(locale) }]}>{greeting}!</Text>
        <Text style={styles.greetingSub}>
          What would you like to do today?
        </Text>
      </Animated.View>

      <View style={styles.zones}>
        {zones.map((zone, i) => (
          <Animated.View
            key={zone.id}
            entering={FadeInDown.delay(200 + i * 120).springify()}
          >
            <PressableScale onPress={() => router.push(zone.route)}>
              <View style={[styles.zoneCard, { backgroundColor: zone.bg, borderColor: zone.color }]}>
                <View style={[styles.zoneIcon, { backgroundColor: zone.color }]}>
                  <Ionicons name={zone.icon} size={28} color="white" />
                </View>
                <View style={styles.zoneText}>
                  <Text style={[styles.zoneTitle, { color: zone.color }]}>{zone.title}</Text>
                  <Text style={styles.zoneSub}>{zone.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.brown[400]} />
              </View>
            </PressableScale>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 44, paddingBottom: 40 },
  greetingSection: { alignItems: "center", marginBottom: 32, paddingHorizontal: 24 },
  greeting: { fontSize: 28, fontWeight: "700", color: COLORS.brown[800], marginTop: 12 },
  greetingSub: { fontSize: 16, color: COLORS.brown[500], marginTop: 4 },
  zones: { gap: 14, paddingHorizontal: 24 },
  zoneCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    gap: 14,
  },
  zoneIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  zoneText: { flex: 1 },
  zoneTitle: { fontSize: 18, fontWeight: "700" },
  zoneSub: { fontSize: 13, color: COLORS.brown[500], marginTop: 2 },
});
