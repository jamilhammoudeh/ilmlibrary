"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

const duas = [
  {
    arabic:
      "أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ",
    translation:
      "I seek refuge with Allah and with His Power from the evil that I find and that I fear",
    source: "Sahih Muslim 2202",
  },
  {
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
    translation:
      "Our Lord! Accept ˹this˺ from us. You are indeed the All-Hearing, All-Knowing",
    source: "Surah Al-Baqarah 2:127",
  },
  {
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation:
      "Our Lord! Grant us the good of this world and the Hereafter, and protect us from the torment of the Fire",
    source: "Surah Al-Baqarah 2:201",
  },
  {
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
    translation:
      "Our Lord! Shower us with perseverance, and let us die while submitting ˹to You˺",
    source: "Surah Al-A'raf 7:126",
  },
  {
    arabic:
      "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    translation:
      "Our Lord! Forgive me, my parents, and the believers on the Day when the judgment will come to pass",
    source: "Surah Ibrahim 14:41",
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "My Lord! Uplift my heart for me, and make my task easy",
    source: "Surah Taha 20:25-26",
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge",
    source: "Surah Taha 20:114",
  },
  {
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    translation:
      "My Lord, indeed I am, for whatever good You would send down to me, in need",
    source: "Surah Al-Qasas 28:24",
  },
  {
    arabic:
      "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
    translation:
      "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication",
    source: "Surah Aal-E-Imran 3:38",
  },
  {
    arabic:
      "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translation:
      "Our Lord, forgive us our sins and our excesses in our affairs and plant firmly our feet and give us victory over the disbelieving people",
    source: "Surah Aal-E-Imran 3:147",
  },
  {
    arabic:
      "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ",
    translation:
      "Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous",
    source: "Surah Aal-E-Imran 3:193",
  },
  {
    arabic:
      "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    translation:
      "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication",
    source: "Surah Ibrahim 14:40",
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالسَّدَادَ",
    translation: "O Allah, I ask You for guidance and soundness",
    source: "Sahih Muslim 2721",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي",
    translation:
      "O Allah, I ask You for forgiveness and well-being in my religious and worldly affairs, and my family and my wealth",
    source: "Sunan Abu Dawood 5074",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ وَتَحَوُّلِ عَافِيَتِكَ وَفُجَاءَةِ نِقْمَتِكَ وَجَمِيعِ سَخَطِكَ",
    translation:
      "O Allah, I seek refuge in You from the removal of Your favor, the loss of Your well-being, the sudden onset of Your vengeance, and all forms of Your wrath",
    source: "Sahih Muslim 2739",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ",
    translation:
      "O Allah, I seek refuge in You from the evil of what I have done and from the evil of what I have not done",
    source: "Sahih Muslim 2716",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ وَالْجُبْنِ وَسُوءِ الْعُمُرِ وَعَذَابِ الْقَبْرِ",
    translation:
      "O Allah, I seek refuge in You from stinginess, cowardice, the evil of old age, and the torment of the grave",
    source: "Sahih Muslim 2723",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَغَلَبَةِ الْعَدُوِّ وَشَمَاتَةِ الْأَعْدَاءِ",
    translation:
      "O Allah, I seek refuge in You from being overwhelmed by debt, overpowered by enemies, and the rejoicing of adversaries",
    source: "Sunan Abu Dawood 1547",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ وَدَرَكِ الشَّقَاءِ وَسُوءِ الْقَضَاءِ وَشَمَاتَةِ الْأَعْدَاءِ",
    translation:
      "O Allah, I seek refuge in You from the trials of severe calamity, from falling into misfortune, from a bad fate, and from the gloating of enemies",
    source: "Sahih Bukhari 6363",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ وَالْمَأْثَمِ وَالْمَغْرَمِ",
    translation:
      "O Allah, I seek refuge in You from laziness, old age, sin, and debt",
    source: "Sahih Bukhari 6364",
  },
  {
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    translation:
      "O Allah, I seek refuge in You from being overpowered by debt and from being overpowered by men",
    source: "Sunan Abu Dawood 1548",
  },
];

export function DuaSlideshow() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * duas.length)
  );
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * duas.length);
          } while (next === prev && duas.length > 1);
          return next;
        });
        setVisible(true);
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const dua = duas[index];

  async function copy() {
    await navigator.clipboard.writeText(
      `${dua.arabic}\n\n${dua.translation}\n\n— ${dua.source}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative bg-teal-600 text-white text-center py-8 px-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <button
        onClick={copy}
        aria-label="Copy dua"
        className="absolute top-4 right-4 text-teal-200 hover:text-white transition-colors"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <div
        className={`transition-opacity duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="arabic-text text-3xl md:text-4xl mb-5 leading-loose">
          {dua.arabic}
        </p>
        <p className="text-lg md:text-xl italic leading-relaxed text-teal-50">
          {dua.translation}{" "}
          <span className="whitespace-nowrap">— {dua.source}</span>
        </p>
      </div>
    </section>
  );
}
