// Popular reciters with correct CDN paths
export const RECITERS = [
  { id: 7, name: "Mishary Rashid Alafasy", short: "Alafasy", verseBase: "https://verses.quran.com/Alafasy/mp3/", surahSlug: "mishari_al_afasy" },
  { id: 3, name: "Abdur-Rahman As-Sudais", short: "Sudais", verseBase: "https://verses.quran.com/Sudais/mp3/", surahSlug: "abdurrahmaan_as_sudais" },
  { id: 2, name: "Abdul Basit Abdus Samad", short: "Abdul Basit", verseBase: "https://verses.quran.com/AbdulBaset/Murattal/mp3/", surahSlug: "abdul_baset" },
  { id: 6, name: "Mahmoud Khalil Al-Husary", short: "Husary", verseBase: "https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/", surahSlug: "khalil_al_husary" },
  { id: 4, name: "Abu Bakr Ash-Shatri", short: "Shatri", verseBase: "https://verses.quran.com/Shatri/mp3/", surahSlug: "abu_bakr_shatri" },
  { id: 10, name: "Sa'ud Ash-Shuraym", short: "Shuraym", verseBase: "https://verses.quran.com/Shuraym/mp3/", surahSlug: "saud_ash-shuraym" },
  { id: 9, name: "Mohamed Siddiq Al-Minshawi", short: "Minshawi", verseBase: "https://verses.quran.com/Minshawi/Murattal/mp3/", surahSlug: "siddiq_minshawi" },
];

// Full surah audio — fetched from Quran.com API for accuracy
export async function fetchSurahAudioUrl(reciterId: number, surahId: number): Promise<string> {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahId}`);
    const data = await res.json();
    return data.audio_file?.audio_url ?? getSurahAudioFallback(reciterId, surahId);
  } catch {
    return getSurahAudioFallback(reciterId, surahId);
  }
}

// Fallback using known slug patterns
export function getSurahAudioFallback(reciterId: number, surahId: number) {
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  return `https://download.quranicaudio.com/qdc/${reciter.surahSlug}/murattal/${surahId}.mp3`;
}

// Per-verse audio — each reciter has their own CDN path
// verseKey format: "1:1" -> padded to "001001"
export function getVerseAudioUrl(reciterId: number, verseKey: string) {
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  const [surah, ayah] = verseKey.split(":");
  const padded = surah.padStart(3, "0") + ayah.padStart(3, "0");
  return `${reciter.verseBase}${padded}.mp3`;
}

// Get a curated Verse of the Day
export function getVerseOfTheDay(): { surah: number; ayah: number; surahName: string; arabic: string; english: string; reference: string } {
  const verses = [
    { surah: 2, ayah: 286, surahName: "Al-Baqarah", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", reference: "Surah Al-Baqarah 2:286" },
    { surah: 3, ayah: 139, surahName: "Aal-Imran", arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ", english: "So do not weaken and do not grieve, and you will be superior if you are true believers.", reference: "Surah Aal-Imran 3:139" },
    { surah: 94, ayah: 6, surahName: "Ash-Sharh", arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", english: "Indeed, with hardship comes ease.", reference: "Surah Ash-Sharh 94:6" },
    { surah: 2, ayah: 152, surahName: "Al-Baqarah", arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", english: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.", reference: "Surah Al-Baqarah 2:152" },
    { surah: 29, ayah: 69, surahName: "Al-Ankabut", arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", english: "And those who strive for Us - We will surely guide them to Our ways.", reference: "Surah Al-Ankabut 29:69" },
    { surah: 65, ayah: 3, surahName: "At-Talaq", arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", english: "And whoever relies upon Allah - then He is sufficient for him.", reference: "Surah At-Talaq 65:3" },
    { surah: 13, ayah: 28, surahName: "Ar-Ra'd", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", english: "Verily, in the remembrance of Allah do hearts find rest.", reference: "Surah Ar-Ra'd 13:28" },
    { surah: 2, ayah: 45, surahName: "Al-Baqarah", arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", english: "And seek help through patience and prayer.", reference: "Surah Al-Baqarah 2:45" },
    { surah: 3, ayah: 173, surahName: "Aal-Imran", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", english: "Sufficient for us is Allah, and He is the best Disposer of affairs.", reference: "Surah Aal-Imran 3:173" },
    { surah: 39, ayah: 53, surahName: "Az-Zumar", arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", english: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'", reference: "Surah Az-Zumar 39:53" },
    { surah: 2, ayah: 186, surahName: "Al-Baqarah", arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", english: "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.", reference: "Surah Al-Baqarah 2:186" },
    { surah: 49, ayah: 13, surahName: "Al-Hujurat", arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ", english: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.", reference: "Surah Al-Hujurat 49:13" },
    { surah: 16, ayah: 97, surahName: "An-Nahl", arabic: "مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً", english: "Whoever does righteousness, whether male or female, while being a believer - We will surely cause them to live a good life.", reference: "Surah An-Nahl 16:97" },
    { surah: 73, ayah: 8, surahName: "Al-Muzzammil", arabic: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا", english: "And remember the name of your Lord and devote yourself to Him with complete devotion.", reference: "Surah Al-Muzzammil 73:8" },
  ];

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return verses[dayOfYear % verses.length];
}

// Quran reading progress storage
const PROGRESS_KEY = "ilm-quran-progress";

export function getReadingSurahs(): Record<number, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markSurahRead(surahId: number) {
  const progress = getReadingSurahs();
  progress[surahId] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getSurahsReadCount(): number {
  return Object.keys(getReadingSurahs()).length;
}
