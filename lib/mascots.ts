import type { Locale } from "./colors";
import type { ImageSourcePropType } from "react-native";

export type MascotPose = "happy" | "celebrating";

const MASCOTS: Record<string, Record<MascotPose, ImageSourcePropType>> = {
  hy: {
    happy: require("../assets/mascots/hy-happy.png"),
    celebrating: require("../assets/mascots/hy-celebrating.png"),
  },
  el: {
    happy: require("../assets/mascots/el-happy.png"),
    celebrating: require("../assets/mascots/el-celebrating.png"),
  },
  ar: {
    happy: require("../assets/mascots/ar-happy.png"),
    celebrating: require("../assets/mascots/ar-celebrating.png"),
  },
};

const MASCOT_NAMES: Record<string, string> = {
  hy: "Nouri",
  el: "Sophia",
  ar: "Zaytoun",
};

export function getMascotImage(locale: Locale, pose: MascotPose = "happy"): ImageSourcePropType {
  return MASCOTS[locale]?.[pose] ?? MASCOTS.hy.happy;
}

export function getMascotName(locale: Locale): string {
  return MASCOT_NAMES[locale] ?? "Nouri";
}
