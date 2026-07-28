export type TafseerLanguageCode = "en" | "ar" | "ur" | "bn" | "ru" | "ku";

export type TafseerMeta = {
  id: string;
  name: string;
  fullName: string;
  author: string;
  language: TafseerLanguageCode;
  languageName: string;
  source: string;
  sourceUrl?: string;
};

export type TafseerMap = Record<string, string>;

export const R2_TAFSEER_BASE_URL =
  "https://pub-727f13aed7e542fb9819ab8f2a92e788.r2.dev";

export const TAFSEERS: TafseerMeta[] = [
  {
    id: "ibn-kathir",
    name: "Ibn Kathir",
    fullName: "Tafsir Ibn Kathir (Abridged)",
    author: "Hafiz Ibn Kathir",
    language: "en",
    languageName: "English",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "maarif-ul-quran",
    name: "Maarif-ul-Quran",
    fullName: "Maarif-ul-Quran",
    author: "Mufti Muhammad Shafi",
    language: "en",
    languageName: "English",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "jalalayn",
    name: "al-Jalalayn",
    fullName: "Tafsir al-Jalalayn",
    author: "Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti",
    language: "en",
    languageName: "English",
    source: "spa5k/tafsir_api - Altafsir upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "ibn-kathir-ar",
    name: "Ibn Kathir",
    fullName: "Tafsir Ibn Kathir",
    author: "Hafiz Ibn Kathir",
    language: "ar",
    languageName: "Arabic",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "tabari",
    name: "al-Tabari",
    fullName: "Jami al-Bayan an Tawil Ay al-Quran",
    author: "Abu Jafar Muhammad ibn Jarir al-Tabari",
    language: "ar",
    languageName: "Arabic",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "baghawi",
    name: "al-Baghawi",
    fullName: "Maalim al-Tanzil",
    author: "Abu Muhammad al-Husayn ibn Masud al-Baghawi",
    language: "ar",
    languageName: "Arabic",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "as-saddi",
    name: "as-Sadi",
    fullName: "Taysir al-Karim al-Rahman fi Tafsir Kalam al-Mannan",
    author: "Abd al-Rahman ibn Nasir al-Sadi",
    language: "ar",
    languageName: "Arabic",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "muyassar",
    name: "al-Muyassar",
    fullName: "al-Tafsir al-Muyassar",
    author: "King Fahd Quran Printing Complex",
    language: "ar",
    languageName: "Arabic",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "ibn-kathir-ur",
    name: "Ibn Kathir",
    fullName: "Tafsir Ibn Kathir",
    author: "Hafiz Ibn Kathir",
    language: "ur",
    languageName: "Urdu",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "ibn-kathir-bn",
    name: "Ibn Kathir",
    fullName: "Tafsir Ibn Kathir",
    author: "Hafiz Ibn Kathir",
    language: "bn",
    languageName: "Bengali",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "ahsanul-bayaan-bn",
    name: "Ahsanul Bayaan",
    fullName: "Tafsir Ahsanul Bayaan",
    author: "Bayaan Foundation",
    language: "bn",
    languageName: "Bengali",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "abu-bakr-zakaria-bn",
    name: "Abu Bakr Zakaria",
    fullName: "Tafsir Abu Bakr Zakaria",
    author: "King Fahd Quran Printing Complex",
    language: "bn",
    languageName: "Bengali",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "as-saddi-ru",
    name: "as-Sadi",
    fullName: "Tafseer al-Sadi",
    author: "Abd al-Rahman ibn Nasir al-Sadi",
    language: "ru",
    languageName: "Russian",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
  {
    id: "rebar-ku",
    name: "Rebar",
    fullName: "Rebar Kurdish Tafsir",
    author: "Rebar Kurdish Tafsir",
    language: "ku",
    languageName: "Kurdish",
    source: "spa5k/tafsir_api - Quran.com upstream",
    sourceUrl: "https://github.com/spa5k/tafsir_api",
  },
];

export const DEFAULT_TAFSEER_ID = "ibn-kathir";

export const TAFSEER_IDS = new Set(TAFSEERS.map((tafseer) => tafseer.id));

export function getTafseer(id: string): TafseerMeta | undefined {
  return TAFSEERS.find((tafseer) => tafseer.id === id);
}

export function isRtlTafseer(tafseer: TafseerMeta | undefined): boolean {
  return (
    tafseer?.language === "ar" ||
    tafseer?.language === "ur" ||
    tafseer?.language === "ku"
  );
}
