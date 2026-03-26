import { Image, View, Text, StyleSheet } from "react-native";
import type { Locale } from "../lib/colors";
import { getMascotImage, getMascotName, type MascotPose } from "../lib/mascots";

interface Props {
  locale: Locale;
  pose?: MascotPose;
  size?: number;
  showName?: boolean;
}

export default function MascotImage({ locale, pose = "happy", size = 120, showName = false }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={getMascotImage(locale, pose)}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showName && (
        <Text style={styles.name}>{getMascotName(locale)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  name: { fontSize: 14, color: "#A08060", marginTop: 4, fontWeight: "500" },
});
