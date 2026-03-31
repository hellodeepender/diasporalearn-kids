import type { Locale } from "./colors";

export function getFontFamily(locale: Locale | string): string | undefined {
  if (locale === "syr") return "NotoSansSyriacEastern";
  return undefined;
}
