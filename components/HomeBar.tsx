import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../lib/colors";
import { useLocale } from "../lib/locale";

interface Props {
  showHome?: boolean;
}

export default function HomeBar({ showHome = true }: Props) {
  const router = useRouter();
  const { setLocale } = useLocale();

  return (
    <View style={styles.bar}>
      {showHome ? (
        <Pressable
          onPress={() => router.replace("/")}
          style={styles.btn}
          hitSlop={8}
        >
          <Ionicons name="home-outline" size={20} color={COLORS.brown[600]} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <Pressable
        onPress={async () => {
          await setLocale(null);
          router.replace("/");
        }}
        style={styles.langBtn}
        hitSlop={8}
      >
        <Ionicons name="globe-outline" size={18} color={COLORS.brown[600]} />
        <Text style={styles.langText}>Change Language</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  spacer: { width: 40 },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  langText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.brown[600],
  },
});
