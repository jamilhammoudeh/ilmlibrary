export type ReciterCategory =
  | "popular"
  | "classic"
  | "modern"
  | "tajweed"
  | "warsh"
  | "rare";

export type ReciterStyle = "murattal" | "mujawwad" | "muallim";

export type WebReciter = {
  id: string;
  nameEnglish: string;
  style: ReciterStyle;
  category: ReciterCategory;
  baseUrl: string;
  bitrate: number;
  hidden?: boolean;
};

const BASE = "https://everyayah.com/data";

export const RECITERS: WebReciter[] = [
  {
    id: "mishary",
    nameEnglish: "Mishary Rashid Alafasy",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Alafasy_128kbps`,
    bitrate: 128,
  },
  {
    id: "shatri",
    nameEnglish: "Abu Bakr Al-Shatri",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Abu_Bakr_Ash-Shaatree_128kbps`,
    bitrate: 128,
  },
  {
    id: "abdulbaset-murattal",
    nameEnglish: "Abdul Basit (Murattal)",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Abdul_Basit_Murattal_192kbps`,
    bitrate: 192,
  },
  {
    id: "shuraim",
    nameEnglish: "Saud Al-Shuraim",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Saood_ash-Shuraym_128kbps`,
    bitrate: 128,
  },
  {
    id: "minshawi-murattal",
    nameEnglish: "Mohamed Siddiq Al-Minshawi",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Minshawy_Murattal_128kbps`,
    bitrate: 128,
  },
  {
    id: "husary",
    nameEnglish: "Mahmoud Khalil Al-Husary",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Husary_128kbps`,
    bitrate: 128,
  },
  {
    id: "sudais",
    nameEnglish: "Abdul Rahman Al-Sudais",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Abdurrahmaan_As-Sudais_192kbps`,
    bitrate: 192,
  },
  {
    id: "ghamdi",
    nameEnglish: "Saad Al-Ghamdi",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Ghamadi_40kbps`,
    bitrate: 40,
  },
  {
    id: "maher",
    nameEnglish: "Maher Al-Muaiqly",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/MaherAlMuaiqly128kbps`,
    bitrate: 128,
  },
  {
    id: "rifai",
    nameEnglish: "Hani Ar-Rifai",
    style: "murattal",
    category: "popular",
    baseUrl: `${BASE}/Hani_Rifai_192kbps`,
    bitrate: 192,
  },
  {
    id: "abdulbaset-mujawwad",
    nameEnglish: "Abdul Basit (Mujawwad)",
    style: "mujawwad",
    category: "classic",
    baseUrl: `${BASE}/Abdul_Basit_Mujawwad_128kbps`,
    bitrate: 128,
  },
  {
    id: "minshawi-mujawwad",
    nameEnglish: "Minshawi (Mujawwad)",
    style: "mujawwad",
    category: "classic",
    baseUrl: `${BASE}/Minshawy_Mujawwad_192kbps`,
    bitrate: 192,
  },
  {
    id: "husary-mujawwad",
    nameEnglish: "Husary (Mujawwad)",
    style: "mujawwad",
    category: "classic",
    baseUrl: `${BASE}/Husary_Mujawwad_64kbps`,
    bitrate: 64,
  },
  {
    id: "mustafa-ismail",
    hidden: true,
    nameEnglish: "Mustafa Ismail",
    style: "mujawwad",
    category: "classic",
    baseUrl: `${BASE}/Mustafa_Ismail_48kbps`,
    bitrate: 48,
  },
  {
    id: "tablawi",
    nameEnglish: "Mohammad Al-Tablawi",
    style: "mujawwad",
    category: "classic",
    baseUrl: `${BASE}/Mohammad_al_Tablaway_128kbps`,
    bitrate: 128,
  },
  {
    id: "bukhatir",
    nameEnglish: "Salah Bukhatir",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/Salaah_AbdulRahman_Bukhatir_128kbps`,
    bitrate: 128,
  },
  {
    id: "tunaiji",
    nameEnglish: "Khalifa Al-Tunaiji",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/khalefa_al_tunaiji_64kbps`,
    bitrate: 64,
  },
  {
    id: "dussary",
    nameEnglish: "Yasser Ad-Dussary",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/Yasser_Ad-Dussary_128kbps`,
    bitrate: 128,
  },
  {
    id: "akhdar",
    nameEnglish: "Ibrahim Al-Akhdar",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/Ibrahim_Akhdar_32kbps`,
    bitrate: 32,
  },
  {
    id: "basfar",
    nameEnglish: "Abdullah Basfar",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/Abdullah_Basfar_192kbps`,
    bitrate: 192,
  },
  {
    id: "juhani",
    nameEnglish: "Abdullah Awad Al-Juhani",
    style: "murattal",
    category: "modern",
    baseUrl: `${BASE}/Abdullaah_3awwaad_Al-Juhaynee_128kbps`,
    bitrate: 128,
  },
  {
    id: "sowaid",
    nameEnglish: "Ayman Suwayd",
    style: "muallim",
    category: "tajweed",
    baseUrl: `${BASE}/Ayman_Sowaid_64kbps`,
    bitrate: 64,
  },
  {
    id: "husary-muallim",
    nameEnglish: "Husary (Muallim)",
    style: "muallim",
    category: "tajweed",
    baseUrl: `${BASE}/Husary_Muallim_128kbps`,
    bitrate: 128,
  },
  {
    id: "abbad",
    hidden: true,
    nameEnglish: "Fares Abbad",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Fares_Abbad_64kbps`,
    bitrate: 64,
  },
  {
    id: "jibril",
    hidden: true,
    nameEnglish: "Mohamed Jibril",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Muhammad_Jibreel_128kbps`,
    bitrate: 128,
  },
  {
    id: "hudhaify",
    hidden: true,
    nameEnglish: "Ali Al-Hudhaify",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Hudhaify_128kbps`,
    bitrate: 128,
  },
  {
    id: "neana",
    hidden: true,
    nameEnglish: "Ahmed Neana",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Ahmed_Neana_128kbps`,
    bitrate: 128,
  },
  {
    id: "qahtani",
    hidden: true,
    nameEnglish: "Khalid Al-Qahtani",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Khaalid_Abdullaah_al-Qahtaanee_192kbps`,
    bitrate: 192,
  },
  {
    id: "jaber",
    hidden: true,
    nameEnglish: "Ali Jaber",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Ali_Jaber_64kbps`,
    bitrate: 64,
  },
  {
    id: "ayyub",
    hidden: true,
    nameEnglish: "Mohammad Ayyub",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Muhammad_Ayyoub_128kbps`,
    bitrate: 128,
  },
  {
    id: "matrood",
    hidden: true,
    nameEnglish: "Abdullah Matrood",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Abdullah_Matroud_128kbps`,
    bitrate: 128,
  },
  {
    id: "sahl-yassin",
    hidden: true,
    nameEnglish: "Sahl Yasin",
    style: "murattal",
    category: "rare",
    baseUrl: `${BASE}/Sahl_Yassin_128kbps`,
    bitrate: 128,
  },
];

export const RECITER_CATEGORY_ORDER: ReciterCategory[] = [
  "popular",
  "classic",
  "modern",
  "tajweed",
  "warsh",
  "rare",
];

export const RECITER_CATEGORY_LABELS: Record<ReciterCategory, string> = {
  popular: "Popular",
  classic: "Classic Recordings",
  modern: "Modern Reciters",
  tajweed: "Tajweed & Learning",
  warsh: "Warsh Narration",
  rare: "More Reciters",
};

export function getReciter(id: string): WebReciter | undefined {
  return RECITERS.find((reciter) => reciter.id === id);
}

export function recitersByCategory({
  includeHidden = true,
}: {
  includeHidden?: boolean;
} = {}): { category: ReciterCategory; reciters: WebReciter[] }[] {
  return RECITER_CATEGORY_ORDER.map((category) => ({
    category,
    reciters: RECITERS.filter(
      (reciter) =>
        reciter.category === category && (includeHidden || !reciter.hidden)
    ),
  })).filter((group) => group.reciters.length > 0);
}

export function ayahAudioUrl(
  reciterId: string,
  surahId: number,
  ayahNumber: number
): string | null {
  const reciter = getReciter(reciterId);
  if (!reciter) return null;
  const surah = String(surahId).padStart(3, "0");
  const ayah = String(ayahNumber).padStart(3, "0");
  return `${reciter.baseUrl}/${surah}${ayah}.mp3`;
}
