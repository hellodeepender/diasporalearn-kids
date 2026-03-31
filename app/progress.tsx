import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import PressableScale from "../components/PressableScale";
import MascotImage from "../components/MascotImage";
import HomeBar from "../components/HomeBar";
import { useLocale } from "../lib/locale";
import { COLORS, getLocaleColors } from "../lib/colors";
import { getAlphabet } from "../lib/alphabet-data";
import { getProgress, type ProgressData } from "../lib/progress";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen() {
  const { locale } = useLocale();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  const loadProgress = useCallback(() => {
    if (locale) {
      getProgress(locale).then(setProgress);
    }
  }, [locale]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

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

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);
  const lettersTotal = alphabet.length;
  const lettersLearned = progress?.lettersViewed.length ?? 0;
  const gamesPlayed = progress?.gamesPlayed ?? 0;
  const gamesWon = progress?.gamesWon ?? 0;
  const accuracy =
    progress && progress.totalAttempts > 0
      ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100)
      : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: COLORS.warmWhite }]}
      contentContainerStyle={styles.content}
    >
      <HomeBar />

      <PressableScale onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
      </PressableScale>

      <View style={styles.heroSection}>
        <MascotImage
          locale={locale}
          pose={gamesPlayed > 5 ? "celebrating" : gamesPlayed > 0 ? "happy" : "reading"}
          size={120}
        />
        <Text style={styles.title}>My Progress</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: colors.primary }]}>
          <Ionicons name="text" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {lettersLearned}
          </Text>
          <Text style={styles.statLabel}>
            of {lettersTotal} Letters{"\n"}Explored
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${lettersTotal > 0 ? Math.round((lettersLearned / lettersTotal) * 100) : 0}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        <View style={[styles.statCard, { borderColor: COLORS.gold }]}>
          <Ionicons name="game-controller" size={24} color={COLORS.gold} />
          <Text style={[styles.statNumber, { color: COLORS.goldDark }]}>
            {gamesPlayed}
          </Text>
          <Text style={styles.statLabel}>Games{"\n"}Played</Text>
        </View>

        <View style={[styles.statCard, { borderColor: "#2ECC71" }]}>
          <Ionicons name="trophy" size={24} color="#2ECC71" />
          <Text style={[styles.statNumber, { color: "#1B8C4F" }]}>
            {gamesWon}
          </Text>
          <Text style={styles.statLabel}>Games{"\n"}Won</Text>
        </View>

        <View style={[styles.statCard, { borderColor: "#3498DB" }]}>
          <Ionicons name="checkmark-circle" size={24} color="#3498DB" />
          <Text style={[styles.statNumber, { color: "#1A6DAD" }]}>
            {accuracy}%
          </Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 44, paddingBottom: 40 },
  back: { marginBottom: 8, paddingHorizontal: 20 },
  heroSection: { alignItems: "center", marginBottom: 28 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.brown[800],
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
  statCard: {
    width: "47%",
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
  },
  statNumber: { fontSize: 32, fontWeight: "700", marginVertical: 4 },
  statLabel: { fontSize: 12, color: COLORS.brown[500], textAlign: "center" },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.brown[100],
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
