import type { Locale } from "./colors";

export interface LetterData {
  letter: string;
  letterLower: string;
  name: string;
  sound: string;
  exampleWord: string;
  exampleWordEn: string;
  emoji: string;
}

const ARMENIAN_LETTERS: LetterData[] = [
  { letter: "Ա", letterLower: "ա", name: "Ayb", sound: "ah", exampleWord: "աչք", exampleWordEn: "eye", emoji: "👁️" },
  { letter: "Բ", letterLower: "բ", name: "Ben", sound: "b", exampleWord: "բադ", exampleWordEn: "duck", emoji: "🦆" },
  { letter: "Գ", letterLower: "գ", name: "Gim", sound: "g", exampleWord: "գիրք", exampleWordEn: "book", emoji: "📖" },
  { letter: "Դ", letterLower: "դ", name: "Da", sound: "d", exampleWord: "դպրոց", exampleWordEn: "school", emoji: "🏫" },
  { letter: "Ե", letterLower: "ե", name: "Yech", sound: "ye", exampleWord: "երկիր", exampleWordEn: "country", emoji: "🌍" },
  { letter: "Զ", letterLower: "զ", name: "Za", sound: "z", exampleWord: "զանգ", exampleWordEn: "bell", emoji: "🔔" },
  { letter: "Է", letterLower: "է", name: "Eh", sound: "eh", exampleWord: "էջ", exampleWordEn: "page", emoji: "📄" },
  { letter: "Ը", letterLower: "ը", name: "Et", sound: "ut", exampleWord: "ընկեր", exampleWordEn: "friend", emoji: "🤝" },
  { letter: "Թ", letterLower: "թ", name: "To", sound: "t", exampleWord: "թիտեռ", exampleWordEn: "butterfly", emoji: "🦋" },
  { letter: "Ժ", letterLower: "ժ", name: "Zhe", sound: "zh", exampleWord: "ժամ", exampleWordEn: "clock", emoji: "⏰" },
  { letter: "Ի", letterLower: "ի", name: "Ini", sound: "ee", exampleWord: "ինը", exampleWordEn: "nine", emoji: "9️⃣" },
  { letter: "Լ", letterLower: "լ", name: "Lyun", sound: "l", exampleWord: "լուսին", exampleWordEn: "moon", emoji: "🌙" },
  { letter: "Խ", letterLower: "խ", name: "Kheh", sound: "kh", exampleWord: "խնձոր", exampleWordEn: "apple", emoji: "🍎" },
  { letter: "Ծ", letterLower: "ծ", name: "Tsa", sound: "ts", exampleWord: "ծառ", exampleWordEn: "tree", emoji: "🌳" },
  { letter: "Կ", letterLower: "կ", name: "Ken", sound: "k", exampleWord: "կատու", exampleWordEn: "cat", emoji: "🐱" },
  { letter: "Հ", letterLower: "հ", name: "Ho", sound: "h", exampleWord: "հաց", exampleWordEn: "bread", emoji: "🍞" },
  { letter: "Ձ", letterLower: "ձ", name: "Dza", sound: "dz", exampleWord: "ձուկ", exampleWordEn: "fish", emoji: "🐟" },
  { letter: "Ղ", letterLower: "ղ", name: "Ghad", sound: "gh", exampleWord: "ղարուն", exampleWordEn: "spring", emoji: "🌼" },
  { letter: "Ճ", letterLower: "ճ", name: "Cheh", sound: "tch", exampleWord: "ճուր", exampleWordEn: "water", emoji: "💧" },
  { letter: "Մ", letterLower: "մ", name: "Men", sound: "m", exampleWord: "մամա", exampleWordEn: "mother", emoji: "👩" },
  { letter: "Յ", letterLower: "յ", name: "Hee", sound: "y", exampleWord: "յոթ", exampleWordEn: "seven", emoji: "7️⃣" },
  { letter: "Ն", letterLower: "ն", name: "Noo", sound: "n", exampleWord: "նավ", exampleWordEn: "ship", emoji: "🚢" },
  { letter: "Շ", letterLower: "շ", name: "Sha", sound: "sh", exampleWord: "շուն", exampleWordEn: "dog", emoji: "🐕" },
  { letter: "Ո", letterLower: "ո", name: "Vo", sound: "v", exampleWord: "ոսկի", exampleWordEn: "gold", emoji: "✨" },
  { letter: "Չ", letterLower: "չ", name: "Cha", sound: "ch", exampleWord: "չանապարհ", exampleWordEn: "road", emoji: "🛤️" },
  { letter: "Պ", letterLower: "պ", name: "Peh", sound: "p", exampleWord: "պտուղ", exampleWordEn: "fruit", emoji: "🍑" },
  { letter: "Ջ", letterLower: "ջ", name: "Jheh", sound: "j", exampleWord: "ջերմ", exampleWordEn: "warm", emoji: "☀️" },
  { letter: "Ռ", letterLower: "ռ", name: "Ra", sound: "r", exampleWord: "ռետ", exampleWordEn: "rubber", emoji: "🧹" },
  { letter: "Ս", letterLower: "ս", name: "Seh", sound: "s", exampleWord: "սիրտ", exampleWordEn: "heart", emoji: "❤️" },
  { letter: "Վ", letterLower: "վ", name: "Vew", sound: "v", exampleWord: "վարդ", exampleWordEn: "rose", emoji: "🌹" },
  { letter: "Տ", letterLower: "տ", name: "Tyun", sound: "t", exampleWord: "տոն", exampleWordEn: "holiday", emoji: "🎉" },
  { letter: "Ր", letterLower: "ր", name: "Reh", sound: "r", exampleWord: "րանգ", exampleWordEn: "color", emoji: "🎨" },
  { letter: "Ց", letterLower: "ց", name: "Tso", sound: "ts", exampleWord: "ցով", exampleWordEn: "sea", emoji: "🌊" },
  { letter: "Ւ", letterLower: "ւ", name: "Vyun", sound: "v", exampleWord: "ւրախ", exampleWordEn: "happy", emoji: "😀" },
  { letter: "Փ", letterLower: "փ", name: "P'yur", sound: "p", exampleWord: "փիսիկ", exampleWordEn: "kitten", emoji: "😻" },
  { letter: "Ք", letterLower: "ք", name: "Keh", sound: "k", exampleWord: "քամի", exampleWordEn: "wind", emoji: "💨" },
  { letter: "Օ", letterLower: "օ", name: "Oh", sound: "o", exampleWord: "օդ", exampleWordEn: "air", emoji: "🌬️" },
  { letter: "Ֆ", letterLower: "ֆ", name: "Feh", sound: "f", exampleWord: "ֆիլ", exampleWordEn: "elephant", emoji: "🐘" },
];

const GREEK_LETTERS: LetterData[] = [
  { letter: "Α", letterLower: "α", name: "Alpha", sound: "ah", exampleWord: "αγάπη", exampleWordEn: "love", emoji: "❤️" },
  { letter: "Β", letterLower: "β", name: "Beta", sound: "v", exampleWord: "βιβλίο", exampleWordEn: "book", emoji: "📖" },
  { letter: "Γ", letterLower: "γ", name: "Gamma", sound: "gh", exampleWord: "γάτα", exampleWordEn: "cat", emoji: "🐱" },
  { letter: "Δ", letterLower: "δ", name: "Delta", sound: "th", exampleWord: "δέντρο", exampleWordEn: "tree", emoji: "🌳" },
  { letter: "Ε", letterLower: "ε", name: "Epsilon", sound: "eh", exampleWord: "ελιά", exampleWordEn: "olive", emoji: "🫒" },
  { letter: "Ζ", letterLower: "ζ", name: "Zeta", sound: "z", exampleWord: "ζώο", exampleWordEn: "animal", emoji: "🐾" },
  { letter: "Η", letterLower: "η", name: "Eta", sound: "ee", exampleWord: "ήλιος", exampleWordEn: "sun", emoji: "☀️" },
  { letter: "Θ", letterLower: "θ", name: "Theta", sound: "th", exampleWord: "θάλασσα", exampleWordEn: "sea", emoji: "🌊" },
  { letter: "Ι", letterLower: "ι", name: "Iota", sound: "ee", exampleWord: "ίππος", exampleWordEn: "horse", emoji: "🐴" },
  { letter: "Κ", letterLower: "κ", name: "Kappa", sound: "k", exampleWord: "κήπος", exampleWordEn: "garden", emoji: "🌻" },
  { letter: "Λ", letterLower: "λ", name: "Lambda", sound: "l", exampleWord: "λουλούδι", exampleWordEn: "flower", emoji: "🌸" },
  { letter: "Μ", letterLower: "μ", name: "Mu", sound: "m", exampleWord: "μήλο", exampleWordEn: "apple", emoji: "🍎" },
  { letter: "Ν", letterLower: "ν", name: "Nu", sound: "n", exampleWord: "νερό", exampleWordEn: "water", emoji: "💧" },
  { letter: "Ξ", letterLower: "ξ", name: "Xi", sound: "ks", exampleWord: "ξύλο", exampleWordEn: "wood", emoji: "🪵" },
  { letter: "Ο", letterLower: "ο", name: "Omicron", sound: "oh", exampleWord: "όμμα", exampleWordEn: "eye", emoji: "👁️" },
  { letter: "Π", letterLower: "π", name: "Pi", sound: "p", exampleWord: "πουλί", exampleWordEn: "bird", emoji: "🐦" },
  { letter: "Ρ", letterLower: "ρ", name: "Rho", sound: "r", exampleWord: "ρολόι", exampleWordEn: "clock", emoji: "⏰" },
  { letter: "Σ", letterLower: "σ", name: "Sigma", sound: "s", exampleWord: "σκύλος", exampleWordEn: "dog", emoji: "🐕" },
  { letter: "Τ", letterLower: "τ", name: "Tau", sound: "t", exampleWord: "τυρί", exampleWordEn: "cheese", emoji: "🧀" },
  { letter: "Υ", letterLower: "υ", name: "Upsilon", sound: "ee", exampleWord: "ύπνος", exampleWordEn: "sleep", emoji: "😴" },
  { letter: "Φ", letterLower: "φ", name: "Phi", sound: "f", exampleWord: "φεγγάρι", exampleWordEn: "moon", emoji: "🌙" },
  { letter: "Χ", letterLower: "χ", name: "Chi", sound: "ch", exampleWord: "χέρι", exampleWordEn: "hand", emoji: "✋" },
  { letter: "Ψ", letterLower: "ψ", name: "Psi", sound: "ps", exampleWord: "ψάρι", exampleWordEn: "fish", emoji: "🐟" },
  { letter: "Ω", letterLower: "ω", name: "Omega", sound: "oh", exampleWord: "ώρα", exampleWordEn: "hour", emoji: "🕐" },
];

const ARABIC_LETTERS: LetterData[] = [
  { letter: "أ", letterLower: "ا", name: "Alif", sound: "ah", exampleWord: "أرنب", exampleWordEn: "rabbit", emoji: "🐰" },
  { letter: "ب", letterLower: "ب", name: "Ba", sound: "b", exampleWord: "بيت", exampleWordEn: "house", emoji: "🏠" },
  { letter: "ت", letterLower: "ت", name: "Ta", sound: "t", exampleWord: "تفاح", exampleWordEn: "apple", emoji: "🍎" },
  { letter: "ث", letterLower: "ث", name: "Tha", sound: "th", exampleWord: "ثعلب", exampleWordEn: "fox", emoji: "🦊" },
  { letter: "ج", letterLower: "ج", name: "Jim", sound: "j", exampleWord: "جمل", exampleWordEn: "camel", emoji: "🐫" },
  { letter: "ح", letterLower: "ح", name: "Ha", sound: "h", exampleWord: "حوت", exampleWordEn: "whale", emoji: "🐳" },
  { letter: "خ", letterLower: "خ", name: "Kha", sound: "kh", exampleWord: "خروف", exampleWordEn: "sheep", emoji: "🐑" },
  { letter: "د", letterLower: "د", name: "Dal", sound: "d", exampleWord: "دب", exampleWordEn: "bear", emoji: "🐻" },
  { letter: "ذ", letterLower: "ذ", name: "Dhal", sound: "dh", exampleWord: "ذهب", exampleWordEn: "gold", emoji: "✨" },
  { letter: "ر", letterLower: "ر", name: "Ra", sound: "r", exampleWord: "رمان", exampleWordEn: "pomegranate", emoji: "🍎" },
  { letter: "ز", letterLower: "ز", name: "Zay", sound: "z", exampleWord: "زهرة", exampleWordEn: "flower", emoji: "🌸" },
  { letter: "س", letterLower: "س", name: "Sin", sound: "s", exampleWord: "سمكة", exampleWordEn: "fish", emoji: "🐟" },
  { letter: "ش", letterLower: "ش", name: "Shin", sound: "sh", exampleWord: "شمس", exampleWordEn: "sun", emoji: "☀️" },
  { letter: "ص", letterLower: "ص", name: "Sad", sound: "s", exampleWord: "صقر", exampleWordEn: "falcon", emoji: "🦅" },
  { letter: "ض", letterLower: "ض", name: "Dad", sound: "d", exampleWord: "ضفدع", exampleWordEn: "frog", emoji: "🐸" },
  { letter: "ط", letterLower: "ط", name: "Taa", sound: "t", exampleWord: "طائر", exampleWordEn: "bird", emoji: "🐦" },
  { letter: "ظ", letterLower: "ظ", name: "Dhaa", sound: "dh", exampleWord: "ظرف", exampleWordEn: "envelope", emoji: "✉️" },
  { letter: "ع", letterLower: "ع", name: "Ain", sound: "a", exampleWord: "عنب", exampleWordEn: "grape", emoji: "🍇" },
  { letter: "غ", letterLower: "غ", name: "Ghain", sound: "gh", exampleWord: "غزال", exampleWordEn: "gazelle", emoji: "🦌" },
  { letter: "ف", letterLower: "ف", name: "Fa", sound: "f", exampleWord: "فراشة", exampleWordEn: "butterfly", emoji: "🦋" },
  { letter: "ق", letterLower: "ق", name: "Qaf", sound: "q", exampleWord: "قمر", exampleWordEn: "moon", emoji: "🌙" },
  { letter: "ك", letterLower: "ك", name: "Kaf", sound: "k", exampleWord: "كتاب", exampleWordEn: "book", emoji: "📖" },
  { letter: "ل", letterLower: "ل", name: "Lam", sound: "l", exampleWord: "ليمون", exampleWordEn: "lemon", emoji: "🍋" },
  { letter: "م", letterLower: "م", name: "Mim", sound: "m", exampleWord: "موز", exampleWordEn: "banana", emoji: "🍌" },
  { letter: "ن", letterLower: "ن", name: "Nun", sound: "n", exampleWord: "نجمة", exampleWordEn: "star", emoji: "⭐" },
  { letter: "ه", letterLower: "ه", name: "Ha", sound: "h", exampleWord: "هدية", exampleWordEn: "gift", emoji: "🎁" },
  { letter: "و", letterLower: "و", name: "Waw", sound: "w", exampleWord: "وردة", exampleWordEn: "rose", emoji: "🌹" },
  { letter: "ي", letterLower: "ي", name: "Ya", sound: "y", exampleWord: "يد", exampleWordEn: "hand", emoji: "✋" },
];

const SYRIAC_LETTERS: LetterData[] = [
  { letter: "\u0710", letterLower: "\u0710", name: "\u0100lap", sound: "a", exampleWord: "\u0710\u0712\u0710", exampleWordEn: "father", emoji: "\uD83D\uDC68" },
  { letter: "\u0712", letterLower: "\u0712", name: "B\u0113th", sound: "b", exampleWord: "\u0712\u071D\u072C\u0710", exampleWordEn: "house", emoji: "\uD83C\uDFE0" },
  { letter: "\u0713", letterLower: "\u0713", name: "G\u0101mal", sound: "g", exampleWord: "\u0713\u0722\u072C\u0710", exampleWordEn: "garden", emoji: "\uD83C\uDF3B" },
  { letter: "\u0715", letterLower: "\u0715", name: "D\u0101lath", sound: "d", exampleWord: "\u0715\u0717\u0712\u0710", exampleWordEn: "gold", emoji: "\u2728" },
  { letter: "\u0717", letterLower: "\u0717", name: "H\u0113", sound: "h", exampleWord: "\u0717\u071D\u071F\u0720\u0710", exampleWordEn: "temple", emoji: "\uD83D\uDED5" },
  { letter: "\u0718", letterLower: "\u0718", name: "W\u0101w", sound: "w", exampleWord: "\u0718\u072A\u0715\u0710", exampleWordEn: "rose", emoji: "\uD83C\uDF39" },
  { letter: "\u0719", letterLower: "\u0719", name: "Zayn", sound: "z", exampleWord: "\u0719\u071D\u072C\u0710", exampleWordEn: "olive", emoji: "\uD83E\uDED2" },
  { letter: "\u071A", letterLower: "\u071A", name: "\u1E24\u0113th", sound: "h", exampleWord: "\u071A\u0721\u072A\u0710", exampleWordEn: "donkey", emoji: "\uD83D\uDC34" },
  { letter: "\u071B", letterLower: "\u071B", name: "\u1E6C\u0113th", sound: "t", exampleWord: "\u071B\u0718\u072A\u0710", exampleWordEn: "mountain", emoji: "\u26F0\uFE0F" },
  { letter: "\u071D", letterLower: "\u071D", name: "Y\u014Ddh", sound: "y", exampleWord: "\u071D\u0721\u0710", exampleWordEn: "sea", emoji: "\uD83C\uDF0A" },
  { letter: "\u071F", letterLower: "\u071F", name: "K\u0101p", sound: "k", exampleWord: "\u071F\u0720\u0712\u0710", exampleWordEn: "dog", emoji: "\uD83D\uDC15" },
  { letter: "\u0720", letterLower: "\u0720", name: "L\u0101madh", sound: "l", exampleWord: "\u0720\u0712\u0710", exampleWordEn: "heart", emoji: "\u2764\uFE0F" },
  { letter: "\u0721", letterLower: "\u0721", name: "M\u012Bm", sound: "m", exampleWord: "\u0721\u071D\u0710", exampleWordEn: "water", emoji: "\uD83D\uDCA7" },
  { letter: "\u0722", letterLower: "\u0722", name: "N\u016Bn", sound: "n", exampleWord: "\u0722\u0718\u0722\u0710", exampleWordEn: "fish", emoji: "\uD83D\uDC1F" },
  { letter: "\u0723", letterLower: "\u0723", name: "Semkath", sound: "s", exampleWord: "\u0723\u0726\u072A\u0710", exampleWordEn: "book", emoji: "\uD83D\uDCD6" },
  { letter: "\u0725", letterLower: "\u0725", name: "\u02BF\u0112", sound: "a", exampleWord: "\u0725\u071D\u0722\u0710", exampleWordEn: "eye", emoji: "\uD83D\uDC41\uFE0F" },
  { letter: "\u0726", letterLower: "\u0726", name: "P\u0113", sound: "p", exampleWord: "\u0726\u0710\u072C\u0710", exampleWordEn: "face", emoji: "\uD83D\uDE0A" },
  { letter: "\u0728", letterLower: "\u0728", name: "\u1E62\u0101dh\u0113", sound: "s", exampleWord: "\u0728\u0720\u0718\u072C\u0710", exampleWordEn: "prayer", emoji: "\uD83D\uDE4F" },
  { letter: "\u0729", letterLower: "\u0729", name: "Q\u014Dp", sound: "q", exampleWord: "\u0729\u0720\u0710", exampleWordEn: "voice", emoji: "\uD83D\uDDE3\uFE0F" },
  { letter: "\u072A", letterLower: "\u072A", name: "R\u0113sh", sound: "r", exampleWord: "\u072A\u072B\u0710", exampleWordEn: "head", emoji: "\uD83E\uDDE0" },
  { letter: "\u072B", letterLower: "\u072B", name: "Sh\u012Bn", sound: "sh", exampleWord: "\u072B\u0721\u072B\u0710", exampleWordEn: "sun", emoji: "\u2600\uFE0F" },
  { letter: "\u072C", letterLower: "\u072C", name: "T\u0101w", sound: "t", exampleWord: "\u072C\u0718\u072A\u0710", exampleWordEn: "bull", emoji: "\uD83D\uDC02" },
];

export function getAlphabet(locale: Locale): LetterData[] {
  switch (locale) {
    case "hy": return ARMENIAN_LETTERS;
    case "el": return GREEK_LETTERS;
    case "ar": return ARABIC_LETTERS;
    case "syr": return SYRIAC_LETTERS;
  }
}

// Dev-only verification: ensure each exampleWord starts with the correct letter
if (__DEV__) {
  const GREEK_ACCENTS: Record<string, string> = {
    "ά": "α", "έ": "ε", "ή": "η", "ί": "ι", "ό": "ο", "ύ": "υ", "ώ": "ω",
  };
  const stripAccent = (ch: string) => GREEK_ACCENTS[ch] ?? ch;

  for (const [locale, letters] of [
    ["hy", ARMENIAN_LETTERS],
    ["el", GREEK_LETTERS],
    ["ar", ARABIC_LETTERS],
    ["syr", SYRIAC_LETTERS],
  ] as const) {
    for (const l of letters) {
      const firstChar = stripAccent(l.exampleWord.charAt(0));
      if (firstChar !== l.letterLower && firstChar !== l.letter) {
        console.warn(
          `[alphabet-data] ${locale} mismatch: "${l.letter}" example "${l.exampleWord}" starts with "${firstChar}"`
        );
      }
    }
  }
}
