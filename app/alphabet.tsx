import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
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
import { useRouter } from "expo-router";
import PressableScale from "../components/PressableScale";
import { useLocale } from "../lib/locale";
import { COLORS, getLocaleColors } from "../lib/colors";
import { getAlphabet, type LetterData } from "../lib/alphabet-data";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function LetterCard({
  item,
  index,
  total,
  colors,
}: {
  item: LetterData;
  index: number;
  total: number;
  colors: ReturnType<typeof getLocaleColors>;
}) {
  const emojiScale = useSharedValue(1);

  // Trigger bounce animation when card appears
  const onLayout = useCallback(() => {
    emojiScale.value = withSequence(
      withTiming(0.6, { duration: 0 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  }, [emojiScale]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  return (
    <View style={[styles.card, { width: SCREEN_WIDTH, backgroundColor: colors.bg }]} onLayout={onLayout}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Animated.View style={[styles.emojiContainer, emojiStyle]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </Animated.View>

        <View style={styles.letterPair}>
          <Text style={[styles.letterUpper, { color: colors.primary }]}>{item.letter}</Text>
          <Text style={[styles.letterLower, { color: colors.primary }]}>{item.letterLower}</Text>
        </View>

        <Text style={styles.letterName}>{item.name}</Text>
        <Text style={styles.soundHint}>sounds like "{item.sound}"</Text>

        <View style={styles.exampleRow}>
          <Text style={[styles.exampleWord, { color: colors.primary }]}>{item.exampleWord}</Text>
          <Text style={styles.exampleTranslation}> ({item.exampleWordEn})</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function AlphabetScreen() {
  const router = useRouter();
  const { locale } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()}>
          <View style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </View>
        </PressableScale>
        <Text style={[styles.counter, { color: colors.primary }]}>
          {currentIndex + 1} / {alphabet.length}
        </Text>
        <View style={styles.backBtn} />
      </View>

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
        renderItem={({ item, index }) => (
          <LetterCard item={item} index={index} total={alphabet.length} colors={colors} />
        )}
      />

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
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  counter: { fontSize: 16, fontWeight: "600" },
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
  letterName: { fontSize: 24, color: COLORS.brown[400], fontWeight: "500", marginBottom: 4 },
  soundHint: { fontSize: 16, color: COLORS.brown[300], marginBottom: 20 },
  exampleRow: { flexDirection: "row", alignItems: "baseline" },
  exampleWord: { fontSize: 22, fontWeight: "600" },
  exampleTranslation: { fontSize: 18, color: COLORS.brown[400] },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
