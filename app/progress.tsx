import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PressableScale from "../components/PressableScale";
import MascotImage from "../components/MascotImage";
import { useLocale } from "../lib/locale";
import { COLORS, getLocaleColors } from "../lib/colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  const router = useRouter();
  const { locale } = useLocale();

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.warmWhite }]}>
      <PressableScale onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
      </PressableScale>

      <View style={styles.content}>
        <MascotImage locale={locale} pose="happy" size={120} />
        <Text style={styles.title}>My Progress</Text>
        <Text style={styles.sub}>Coming soon! Your badges and streaks will appear here.</Text>

        <View style={[styles.previewCard, { borderColor: colors.primary }]}>
          <Text style={styles.previewLabel}>Letters Learned</Text>
          <Text style={[styles.previewNumber, { color: colors.primary }]}>0</Text>
        </View>

        <View style={[styles.previewCard, { borderColor: COLORS.gold }]}>
          <Text style={styles.previewLabel}>Games Played</Text>
          <Text style={[styles.previewNumber, { color: COLORS.gold }]}>0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { paddingHorizontal: 24, paddingTop: 16 },
  content: { flex: 1, alignItems: "center", paddingTop: 32, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.brown[800], marginTop: 16 },
  sub: { fontSize: 15, color: COLORS.brown[400], marginTop: 8, textAlign: "center", maxWidth: 280 },
  previewCard: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "white",
  },
  previewLabel: { fontSize: 14, color: COLORS.brown[400] },
  previewNumber: { fontSize: 36, fontWeight: "700", marginTop: 4 },
});
