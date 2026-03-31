import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  BackHandler,
  type ViewToken,
} from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import PressableScale from "../components/PressableScale";
import HomeBar from "../components/HomeBar";
import { useLocale } from "../lib/locale";
import { COLORS, getLocaleColors } from "../lib/colors";
import { getAlphabet, type LetterData } from "../lib/alphabet-data";
import { Ionicons } from "@expo/vector-icons";
import { speakLetter, speakWord } from "../lib/speech";
import { playSound } from "../lib/sounds";
import { recordLetterViewed } from "../lib/progress";
import MascotImage from "../components/MascotImage";
import { getFontFamily } from "../lib/fonts";
import type { Locale } from "../lib/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ONBOARDING_KEY = "alphabet_onboarding_seen";

function LetterCard({
  item,
  index,
  total,
  colors,
  locale,
}: {
  item: LetterData;
  index: number;
  total: number;
  colors: ReturnType<typeof getLocaleColors>;
  locale: Locale;
}) {
  const emojiScale = useSharedValue(1);

  const onLayout = useCallback(() => {
    emojiScale.value = withSequence(
      withTiming(0.6, { duration: 0 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  }, [emojiScale]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const fontFamily = getFontFamily(locale);

  const handleListen = () => {
    playSound("tap");
    speakLetter(item.letter, locale);
    setTimeout(() => speakWord(item.exampleWord, locale), 1000);
  };

  return (
    <View style={[styles.card, { width: SCREEN_WIDTH, backgroundColor: colors.bg }]} onLayout={onLayout}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Animated.View style={[styles.emojiContainer, emojiStyle]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </Animated.View>

        <View style={styles.letterPair}>
          <Text style={[styles.letterUpper, { color: colors.primary, fontFamily }]}>{item.letter}</Text>
          <Text style={[styles.letterLower, { color: colors.primary, fontFamily }]}>{item.letterLower}</Text>
        </View>

        <Text style={styles.letterName}>{item.name}</Text>
        <Text style={styles.soundHint}>sounds like "{item.sound}"</Text>

        <View style={styles.exampleRow}>
          <Text style={[styles.exampleWord, { color: colors.primary, fontFamily }]}>{item.exampleWord}</Text>
          <Text style={styles.exampleTranslation}> ({item.exampleWordEn})</Text>
        </View>

        <PressableScale onPress={handleListen} style={styles.listenButton}>
          <Ionicons name="volume-high" size={28} color="white" />
          <Text style={styles.listenText}>Listen</Text>
        </PressableScale>
      </Animated.View>
    </View>
  );
}

export default function AlphabetScreen() {
  const router = useRouter();
  const { locale } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const flatListRef = useRef<FlatList<LetterData>>(null);

  if (!locale) {
    router.replace("/");
    return null;
  }

  const colors = getLocaleColors(locale);
  const alphabet = getAlphabet(locale);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  useEffect(() => {
    if (alphabet.length > 0) {
      recordLetterViewed(locale, alphabet[0].letter);
    }
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((v) => {
      if (!v) setShowOnboarding(true);
    });
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    AsyncStorage.setItem(ONBOARDING_KEY, "1");
  };

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  const goToIndex = (index: number) => {
    if (index < 0 || index >= alphabet.length) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
    playSound("tap");
    recordLetterViewed(locale, alphabet[index].letter);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <HomeBar />

      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <View style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </View>
        </PressableScale>
        <View style={styles.headerCenter}>
          <MascotImage locale={locale} pose="reading" size={36} />
          <Text style={[styles.counter, { color: colors.primary }]}>
            {currentIndex + 1} / {alphabet.length}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.listArea}>
        <FlatList
          ref={flatListRef}
          data={alphabet}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            if (index >= 0 && index < alphabet.length) {
              setCurrentIndex(index);
              playSound("tap");
              recordLetterViewed(locale, alphabet[index].letter);
            }
          }}
          renderItem={({ item, index }) => (
            <LetterCard item={item} index={index} total={alphabet.length} colors={colors} locale={locale} />
          )}
        />

        <Pressable
          onPress={() => goToIndex(currentIndex - 1)}
          style={[styles.arrowBtn, styles.arrowLeft, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
          disabled={currentIndex === 0}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={28} color={colors.primary} />
        </Pressable>

        <Pressable
          onPress={() => goToIndex(currentIndex + 1)}
          style={[styles.arrowBtn, styles.arrowRight, { opacity: currentIndex >= alphabet.length - 1 ? 0.3 : 1 }]}
          disabled={currentIndex >= alphabet.length - 1}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={28} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.dots}>
        {alphabet.length <= 40 &&
          alphabet.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? colors.primary : colors.primaryLight,
                },
              ]}
            />
          ))}
      </View>

      {showOnboarding && (
        <Pressable style={styles.onboarding} onPress={dismissOnboarding}>
          <View style={styles.onboardingBox}>
            <Text style={styles.onboardingText}>
              Tap arrows or swipe to explore letters
            </Text>
            <Text style={styles.onboardingArrows}>← →</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 44 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  counter: { fontSize: 16, fontWeight: "600" },
  listArea: { flex: 1, position: "relative" },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emojiContainer: { alignItems: "center", marginBottom: 24 },
  emoji: { fontSize: 80 },
  letterPair: { flexDirection: "row", alignItems: "baseline", gap: 16, marginBottom: 8 },
  letterUpper: { fontSize: 72, fontWeight: "700" },
  letterLower: { fontSize: 48, fontWeight: "600" },
  letterName: { fontSize: 24, color: COLORS.brown[500], fontWeight: "500", marginBottom: 4 },
  soundHint: { fontSize: 16, color: COLORS.brown[500], marginBottom: 20 },
  exampleRow: { flexDirection: "row", alignItems: "baseline" },
  exampleWord: { fontSize: 22, fontWeight: "600" },
  exampleTranslation: { fontSize: 18, color: COLORS.brown[500] },
  listenButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.goldDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    marginTop: 16,
  },
  listenText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrowBtn: {
    position: "absolute",
    top: "45%",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft: { left: 8 },
  arrowRight: { right: 8 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: 24,
    paddingBottom: 64,
    paddingTop: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  onboarding: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  onboardingBox: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    marginHorizontal: 40,
  },
  onboardingText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.brown[700],
    textAlign: "center",
  },
  onboardingArrows: {
    fontSize: 32,
    color: COLORS.brown[500],
    marginTop: 8,
    letterSpacing: 8,
  },
});
