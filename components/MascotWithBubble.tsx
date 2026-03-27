import { View, Text, StyleSheet } from "react-native";
import MascotImage from "./MascotImage";
import type { Locale } from "../lib/colors";
import type { MascotPose } from "../lib/mascots";
import { COLORS } from "../lib/colors";

interface Props {
  locale: Locale;
  pose?: MascotPose;
  size?: number;
  message: string;
}

export default function MascotWithBubble({ locale, pose = "happy", size = 80, message }: Props) {
  return (
    <View style={styles.container}>
      <MascotImage locale={locale} pose={pose} size={size} />
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{message}</Text>
        <View style={styles.bubbleTail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 16,
  },
  bubble: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.brown[100],
    padding: 12,
    position: "relative",
  },
  bubbleText: {
    fontSize: 15,
    color: COLORS.brown[700],
    lineHeight: 20,
  },
  bubbleTail: {
    position: "absolute",
    left: -6,
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "white",
  },
});
