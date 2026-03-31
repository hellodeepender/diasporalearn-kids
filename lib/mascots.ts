import type { Locale } from "./colors";
import type { ImageSourcePropType } from "react-native";

export type MascotPose = "happy" | "celebrating" | "thinking" | "sad" | "reading" | "sleeping";

// hy has all 6 poses; el and ar only have happy + celebrating for now.
// getMascotImage() falls back to "happy" for missing poses.
const MASCOTS: Record<string, Partial<Record<MascotPose, ImageSourcePropType>>> = {
  hy: {
    happy: require("../assets/mascots/hy-happy.png"),
    celebrating: require("../assets/mascots/hy-celebrating.png"),
    thinking: require("../assets/mascots/hy-thinking.png"),
    sad: require("../assets/mascots/hy-sad.png"),
    reading: require("../assets/mascots/hy-reading.png"),
    sleeping: require("../assets/mascots/hy-sleeping.png"),
  },
  el: {
    happy: require("../assets/mascots/el-happy.png"),
    celebrating: require("../assets/mascots/el-celebrating.png"),
  },
  ar: {
    happy: require("../assets/mascots/ar-happy.png"),
    celebrating: require("../assets/mascots/ar-celebrating.png"),
  },
  syr: {
    happy: require("../assets/mascots/syr-lamassu.png"),
    celebrating: require("../assets/mascots/syr-lamassu.png"),
  },
};

const MASCOT_NAMES: Record<string, string> = {
  hy: "Nouri",
  el: "Sophia",
  ar: "Zaytoun",
  syr: "Lamassu",
};

export function getMascotImage(locale: Locale, pose: MascotPose = "happy"): ImageSourcePropType {
  const poses = MASCOTS[locale] ?? MASCOTS.hy;
  return poses[pose] ?? poses.happy!;
}

export function getMascotName(locale: Locale): string {
  return MASCOT_NAMES[locale] ?? "Nouri";
}
