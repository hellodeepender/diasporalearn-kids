export const COLORS = {
  warmWhite: "#FFF8F0",
  cream: "#F5EDE0",
  brown: {
    50: "#FAF6F1",
    100: "#F0E8DD",
    200: "#E0D0BB",
    300: "#C4A882",
    400: "#A08060",
    500: "#8B6F47",
    600: "#725A38",
    700: "#5A4529",
    800: "#3D2E1A",
  },
  gold: "#D4A843",
  goldDark: "#B8922E",

  locale: {
    hy: {
      primary: "#C4384B",
      primaryLight: "#F5C4B3",
      primaryDark: "#8B1A2B",
      accent: "#D4A843",
      bg: "#FFF0F2",
    },
    el: {
      primary: "#1A5276",
      primaryLight: "#AED6F1",
      primaryDark: "#0E3A5C",
      accent: "#F39C12",
      bg: "#F0F6FF",
    },
    ar: {
      primary: "#1E8449",
      primaryLight: "#A9DFBF",
      primaryDark: "#145A32",
      accent: "#D4A843",
      bg: "#F0FFF4",
    },
  },
} as const;

export type Locale = "hy" | "el" | "ar";

export function getLocaleColors(locale: Locale) {
  return COLORS.locale[locale];
}
