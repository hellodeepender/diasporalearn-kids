import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import PressableScale from "../components/PressableScale";
import MascotImage from "../components/MascotImage";
import { useLocale } from "../lib/locale";
import { COLORS, type Locale } from "../lib/colors";

const LANGUAGES: { locale: Locale; name: string; nameEn: string; flag: string }[] = [
  { locale: "hy", name: "\u0540\u0561\u0575\u0565\u0580\u0567\u0576", nameEn: "Armenian", flag: "\uD83C\uDDE6\uD83C\uDDF2" },
  { locale: "el", name: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", nameEn: "Greek", flag: "\uD83C\uDDEC\uD83C\uDDF7" },
  { locale: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", nameEn: "Arabic", flag: "\uD83C\uDDF1\uD83C\uDDE7" },
];

export default function LanguagePicker() {
  const router = useRouter();
  const { locale: savedLocale, setLocale } = useLocale();

  // If locale already saved, go straight to home
  if (savedLocale) {
    router.replace("/home");
    return null;
  }

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
          return (
            <Animated.View
              key={lang.locale}
              entering={FadeInDown.delay(300 + i * 150).springify()}
            >
              <PressableScale onPress={() => handlePick(lang.locale)}>
                <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.primary }]}>
                  <MascotImage locale={lang.locale} size={80} />
                  <View style={styles.cardText}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                    <Text style={[styles.langName, { color: colors.primary }]}>{lang.name}</Text>
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
    paddingTop: 80,
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
    color: COLORS.brown[400],
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  cards: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    gap: 16,
  },
  cardText: {
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginBottom: 4,
  },
  langName: {
    fontSize: 24,
    fontWeight: "700",
  },
  langNameEn: {
    fontSize: 14,
    color: COLORS.brown[400],
    marginTop: 2,
  },
});
