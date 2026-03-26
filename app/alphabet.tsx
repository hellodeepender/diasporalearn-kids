import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PressableScale from "../components/PressableScale";
import { COLORS } from "../lib/colors";
import { Ionicons } from "@expo/vector-icons";

export default function AlphabetScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PressableScale onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={COLORS.brown[600]} />
      </PressableScale>
      <Text style={styles.title}>Learn Letters</Text>
      <Text style={styles.sub}>Coming in Phase 2!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.warmWhite, paddingTop: 60, paddingHorizontal: 24 },
  back: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.brown[800] },
  sub: { fontSize: 16, color: COLORS.brown[400], marginTop: 8 },
});
