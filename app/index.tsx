import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import PressableScale from "../components/PressableScale";
import MascotImage from "../components/MascotImage";
import { useLocale } from "../lib/locale";
import { COLORS, type Locale } from "../lib/colors";
import { getFontFamily } from "../lib/fonts";

const LANGUAGES: { locale: Locale; name: string; nameEn: string; flag: string; hasMascot: boolean }[] = [
  { locale: "hy", name: "\u0540\u0561\u0575\u0565\u0580\u0567\u0576", nameEn: "Armenian", flag: "\uD83C\uDDE6\uD83C\uDDF2", hasMascot: true },
  { locale: "el", name: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", nameEn: "Greek", flag: "\uD83C\uDDEC\uD83C\uDDF7", hasMascot: true },
  { locale: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", nameEn: "Arabic", flag: "\uD83C\uDDF1\uD83C\uDDE7", hasMascot: true },
  { locale: "syr", name: "\u0723\u0718\u072A\u071D\u072C", nameEn: "Assyrian", flag: "\uD83D\uDC02", hasMascot: false },
];

export default function LanguagePicker() {
  const router = useRouter();
  const { locale: savedLocale, setLocale } = useLocale();

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (savedLocale && !redirected) {
      setRedirected(true);
      router.replace("/home");
    }
  }, []);

  const handlePick = async (locale: Locale) => {
    await setLocale(locale);
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(100).springify()}>
        <Text style={styles.title}>DiasporaLearn</Text>
        <Text style={styles.subtitle}>Choose your language!</Text>
      </Animated.View>

      <View style={styles.cards}>
        {LANGUAGES.map((lang, i) => {
          const colors = COLORS.locale[lang.locale];
          const syriacFont = getFontFamily(lang.locale);
          return (
            <Animated.View
              key={lang.locale}
              entering={FadeInDown.delay(300 + i * 150).springify()}
            >
              <PressableScale onPress={() => handlePick(lang.locale)}>
                <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.primary }]}>
                  {lang.hasMascot ? (
                    <MascotImage locale={lang.locale} size={80} />
                  ) : (
                    <View style={styles.emojiMascot}>
                      <Text style={styles.emojiMascotText}>{lang.flag}</Text>
                    </View>
                  )}
                  <View style={styles.cardText}>
                    <Text style={[styles.langName, { color: colors.primary, fontFamily: syriacFont }]}>{lang.name}</Text>
                    <Text style={styles.langNameEn}>{lang.nameEn}</Text>
                  </View>
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.warmWhite,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.brown[800],
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.brown[500],
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  cards: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    padding: 14,
    gap: 14,
  },
  cardText: {
    flex: 1,
  },
  langName: {
    fontSize: 22,
    fontWeight: "700",
  },
  langNameEn: {
    fontSize: 14,
    color: COLORS.brown[500],
    marginTop: 2,
  },
  emojiMascot: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiMascotText: {
    fontSize: 48,
  },
});
