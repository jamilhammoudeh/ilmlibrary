import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  HelpCircle,
  Layers,
  BookOpen,
  Search,
  Scale,
} from "lucide-react";
import {
  MiraclesTabs,
  type QuranicMiracle,
  type PhysicalMiracle,
} from "./miracles-tabs";

const motivation = [
  {
    text: "The Hour has come near, and the moon has split.",
    source: "Surah Al-Qamar 54:1",
  },
  {
    text: "Glorified is He who took His Servant by night from al-Masjid al-Ḥarām to al-Masjid al-Aqṣā, whose surroundings We have blessed, to show him of Our signs.",
    source: "Surah Al-Isrāʾ 17:1",
  },
  {
    text: "Say: Glory be to my Lord! Am I anything but a human, a messenger?",
    source: "Surah Al-Isrāʾ 17:93",
  },
];

const whatIsAMiracle = [
  {
    title: "A sign from Allah, not from the messenger",
    description:
      "In Islamic theology, a miracle (muʿjizah) is an extraordinary act that only Allah has the power to perform. The Prophet ﷺ did not claim power on his own. He repeatedly reminded people: 'I am only a human being like you' (Al-Kahf 18:110). Every miracle is Allah showing His support for His messenger, not the messenger bending reality.",
  },
  {
    title: "Outside normal causes, by Allah's permission",
    description:
      "A miracle is something that, by every natural measure, should not happen. The moon does not split. Water does not flow from fingers. A tree trunk does not cry. These events happened in the presence of witnesses, by Allah's permission, as signs to confirm the Prophet's ﷺ message.",
  },
  {
    title: "Witnessed and transmitted",
    description:
      "For Islamic scholars, a miracle only has evidentiary weight if it is well-attested: multiple credible witnesses, preserved through reliable chains of transmission (isnād), and recorded in authenticated hadith collections. Fabricated miracles are not miracles in Islam.",
  },
];

const quranicMiracles: QuranicMiracle[] = [
  {
    title: "The Splitting of the Moon",
    verse: "Sūrah Al-Qamar 54:1-2",
    arabic:
      "ٱقْتَرَبَتِ ٱلسَّاعَةُ وَٱنشَقَّ ٱلْقَمَرُ ﴿١﴾ وَإِن يَرَوْا۟ ءَايَةً يُعْرِضُوا۟ وَيَقُولُوا۟ سِحْرٌ مُّسْتَمِرٌّ ﴿٢﴾",
    translation:
      "The Hour has come near, and the moon has split. But when they see a sign, they turn away and say: 'This is magic, continuing.'",
    story:
      "In the Makkan period, before the Hijrah, the polytheists of Quraysh demanded a miracle as a sign of prophethood. The Prophet ﷺ pointed to the moon, and by Allah's permission, it split into two visible pieces. Those present saw the two halves with Mount Ḥirāʾ between them. The Quraysh, rather than accepting the sign, accused the Prophet ﷺ of magic.",
    companionTestimony:
      "Multiple Companions reported this event. Anas ibn Mālik رضي الله عنه said: 'The people of Makkah asked the Prophet ﷺ for a sign, so he showed them the splitting of the moon, split into two, until they saw Ḥirāʾ between them.' (Ṣaḥīḥ al-Bukhārī 3637). ʿAbdullāh ibn Masʿūd رضي الله عنه said he saw the moon split while they were with the Prophet ﷺ at Minā: one half was behind the mountain and one in front of it. (Ṣaḥīḥ al-Bukhārī 3636).",
    scholarlyNotes:
      "Both the Qur'anic text and multiple authenticated hadith confirm this event happened historically. Ibn Kathīr devotes extensive space in his tafsīr to this miracle, quoting multiple chains of narration. Classical scholars note that the event could not have been mass hallucination: the Qur'an was revealed referencing it publicly, and the Quraysh, though hostile, did not deny it occurred; they attributed it to magic instead.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3636, 3637, 3638 (narrations from Ibn Masʿūd and Anas رضي الله عنهما)",
      "Ṣaḥīḥ Muslim 2800, 2801, 2802 (agreed-upon, muttafaq ʿalayh)",
      "Tafsīr Ibn Kathīr on Sūrah Al-Qamar",
      "Tafsīr aṭ-Ṭabarī on Sūrah Al-Qamar",
      "Narrated by at least four Companions: Ibn Masʿūd, Anas, Ibn ʿAbbās, and Jubayr ibn Muṭʿim رضي الله عنهم",
    ],
  },
  {
    title: "The Night Journey and Ascension (Isrāʾ and Miʿrāj)",
    verse: "Sūrah Al-Isrāʾ 17:1 and An-Najm 53:13-18",
    arabic:
      "سُبْحَـٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا ٱلَّذِى بَـٰرَكْنَا حَوْلَهُۥ لِنُرِيَهُۥ مِنْ ءَايَـٰتِنَآ ۚ إِنَّهُۥ هُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ ﴿١﴾",
    translation:
      "Glorified is He who took His Servant by night from al-Masjid al-Ḥarām (in Makkah) to al-Masjid al-Aqṣā (in Jerusalem), whose surroundings We have blessed, to show him of Our signs. Indeed, He is the Hearing, the Seeing.",
    story:
      "Approximately one year before the Hijrah, the Prophet ﷺ was taken in one night from Makkah to Jerusalem (the Isrāʾ, or Night Journey) on a mount called al-Burāq, led by the angel Jibrīl. From Jerusalem, he ascended through the seven heavens (the Miʿrāj, or Ascension), meeting the previous prophets at each level, and finally reaching a station beyond any creation has ever reached, where Allah spoke to him directly and commanded the five daily prayers.",
    companionTestimony:
      "The detailed narrative is preserved in multiple long hadith. Anas ibn Mālik رضي الله عنه reported from Mālik ibn Ṣaʿṣaʿah رضي الله عنه the Prophet's ﷺ own description of the journey, meeting ʿĪsā (Jesus), Mūsā (Moses), Ibrāhīm (Abraham), Yaḥyā (John), ʿĪsā, Hārūn (Aaron), and Idrīs at different heavens. (Ṣaḥīḥ al-Bukhārī 3887, Ṣaḥīḥ Muslim 164). When the Prophet ﷺ described the architectural details of Jerusalem to Quraysh the next morning, they were verified by those who knew the city.",
    scholarlyNotes:
      "Classical scholars consensus this event happened with both body and soul, not as a dream, based on the weight of hadith evidence. Abū Bakr رضي الله عنه earned the title aṣ-Ṣiddīq (the Truthful) at this point, because when Quraysh mocked the story, he said: 'If he said it, then it is true.' The Prophet ﷺ describing Jerusalem's details accurately, without having traveled there before, was itself a confirming sign.",
    evidence: [
      "Sūrah Al-Isrāʾ 17:1 (the Isrāʾ)",
      "Sūrah An-Najm 53:13-18 (the Miʿrāj, the Lote Tree of the Farthest Boundary)",
      "Ṣaḥīḥ al-Bukhārī 349, 3887, 3207, 7517 (multiple detailed narrations)",
      "Ṣaḥīḥ Muslim 162, 163, 164 (the most complete accounts)",
      "Classical seerah: Ibn Hishām's Sīrah, narrative of the Night Journey",
      "Ibn Kathīr's Al-Bidāyah wan-Nihāyah, section on the Isrāʾ and Miʿrāj",
    ],
  },
];

const physicalMiracles: PhysicalMiracle[] = [
  {
    title: "Water Flowing from Between His Fingers",
    arabic:
      "أَتَى النَّبِيُّ ﷺ بِإِنَاءٍ فِيهِ مَاءٌ ، فَجَعَلَ الْمَاءُ يَنْبُعُ مِنْ بَيْنِ أَصَابِعِهِ",
    story:
      "On multiple occasions when a large number of Muslims had no water to drink or to make wuḍūʾ, the Prophet ﷺ would place his hand in a vessel of a small amount of water, and water would flow out from between his fingers in quantities that provided for hundreds or even thousands of people and their animals.",
    source: "Ṣaḥīḥ al-Bukhārī 3576, Ṣaḥīḥ Muslim 2279",
    grading: "Ṣaḥīḥ (agreed upon)",
    historicalNotes:
      "Jābir ibn ʿAbdullāh رضي الله عنه reported this happened at Ḥudaybiyyah when the people were thirsty and had only a little water. Anas رضي الله عنه reported witnessing similar events at other times. Multiple Companions independently transmitted this. The numbers were so large (1,400 people at Ḥudaybiyyah) that mass fabrication would have been impossible.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3576 (narration of Jābir رضي الله عنه at Ḥudaybiyyah)",
      "Ṣaḥīḥ al-Bukhārī 169, 195, 3575 (other occasions)",
      "Ṣaḥīḥ Muslim 2279",
      "Narrated by at least four Companions: Anas, Jābir, Ibn Masʿūd, and Abū Qatādah رضي الله عنهم",
    ],
  },
  {
    title: "The Crying of the Palm Tree Trunk (Ḥanīn al-Jidhʿ)",
    arabic:
      "فَلَمَّا جَاءَتِ الْجُمُعَةُ ، جَلَسَ النَّبِيُّ ﷺ عَلَى الْمِنْبَرِ ، فَصَاحَتِ النَّخْلَةُ الَّتِي كَانَ يَخْطُبُ عِنْدَهَا حَتَّى كَادَتْ أَنْ تَنْشَقَّ",
    story:
      "The Prophet ﷺ used to lean against a date palm trunk while delivering the Friday khuṭbah in the Masjid of Madīnah. When a wooden minbar was built for him and he moved to it, the trunk cried loudly like a child grieving. The Prophet ﷺ descended from the minbar, embraced the trunk, and it calmed down.",
    source: "Ṣaḥīḥ al-Bukhārī 3584, Sunan at-Tirmidhī 3627",
    grading: "Ṣaḥīḥ (highest, with multiple chains)",
    historicalNotes:
      "Jābir ibn ʿAbdullāh, Ibn ʿUmar, Anas, and Ibn ʿAbbās رضي الله عنهم all narrated versions of this event. It is considered mutawātir (reaching the highest level of mass transmission) by many hadith scholars because of the sheer number of Companions who reported it. Al-Ḥasan al-Baṣrī used to weep when narrating it, saying: 'A piece of wood missed the Prophet ﷺ. You have more reason to miss him than a piece of wood.'",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3583, 3584, 3585",
      "Ṣaḥīḥ al-Bukhārī 917, 918 (in the Book of Jumuʿah)",
      "Sunan at-Tirmidhī 3627 (graded ḥasan ṣaḥīḥ)",
      "Sunan an-Nasāʾī 1396",
      "Musnad Aḥmad (multiple chains)",
      "Reported by at least 10 different Companions, reaching the level of tawātur",
    ],
  },
  {
    title: "Food Multiplying in His Presence",
    story:
      "On multiple well-documented occasions, small amounts of food became enough to feed large gatherings when the Prophet ﷺ placed his hand on it and supplicated. During the Battle of the Trench (5 AH), Jābir ibn ʿAbdullāh رضي الله عنه invited the Prophet ﷺ to a small meal meant for just a few; the Prophet ﷺ came with around 1,000 Companions, and they all ate to satisfaction from what was prepared for a handful.",
    source: "Ṣaḥīḥ al-Bukhārī 4101, 4102",
    grading: "Ṣaḥīḥ (agreed upon)",
    historicalNotes:
      "Similar events happened at different times. Anas ibn Mālik رضي الله عنه described small dates and a little butter feeding 80 men at his home during the walīmah of Zaynab bint Jaḥsh رضي الله عنها. Abū Hurayrah رضي الله عنه described a small bowl of dates feeding the whole army of ahl aṣ-ṣuffah. These events were publicly known, and the Companions who witnessed them were numerous.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 4101 (Battle of the Trench narration)",
      "Ṣaḥīḥ al-Bukhārī 5381 (Anas and the walīmah of Zaynab)",
      "Ṣaḥīḥ Muslim 2040 (Abū Hurayrah's account)",
      "Ṣaḥīḥ al-Bukhārī 3578 (multiple accounts compiled)",
      "Narrated by at least six Companions",
    ],
  },
  {
    title: "Food and Pebbles Glorifying Allah in His Hand",
    arabic:
      "إِنْ كُنَّا لَنَسْمَعُ تَسْبِيحَ الطَّعَامِ وَهُوَ يُؤْكَلُ",
    story:
      "The Companions reported that they would hear food glorifying Allah (tasbīḥ) while it was being eaten in the presence of the Prophet ﷺ. On another occasion, the Prophet ﷺ held small pebbles in his hand and the Companions heard them audibly proclaiming 'SubḥānAllāh'.",
    source: "Ṣaḥīḥ al-Bukhārī 3579",
    grading: "Ṣaḥīḥ",
    historicalNotes:
      "The hadith about food glorifying is narrated by ʿAbdullāh ibn Masʿūd رضي الله عنه. The hadith about pebbles is narrated by multiple Companions including Abū Dharr رضي الله عنه. Classical scholars note this is consistent with the Qur'anic statement: 'The seven heavens and the earth and whatever is in them exalt Him. And there is not a thing except that it exalts Him by His praise, but you do not understand their exaltation.' (Al-Isrāʾ 17:44). The miracle was not that things glorified Allah (they always do) but that the Companions were able to hear it.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3579 (food glorifying, from Ibn Masʿūd)",
      "Jāmiʿ at-Tirmidhī 3633 (pebbles in the hand)",
      "Musnad Aḥmad 3664",
      "Qur'anic support: Sūrah Al-Isrāʾ 17:44",
    ],
  },
  {
    title: "The Healing of ʿAlī's Eye at Khaybar",
    story:
      "Before the Battle of Khaybar (7 AH), ʿAlī ibn Abī Ṭālib رضي الله عنه was suffering from a severe eye infection, to the point where he could barely see. The Prophet ﷺ called for him, placed some of his saliva in ʿAlī's eyes, and supplicated. ʿAlī was cured immediately, and led the Muslims to victory at Khaybar.",
    source: "Ṣaḥīḥ al-Bukhārī 4210, Ṣaḥīḥ Muslim 2406",
    grading: "Ṣaḥīḥ (agreed upon)",
    historicalNotes:
      "Reported by Salamah ibn al-Akwaʿ رضي الله عنه and Sahl ibn Saʿd رضي الله عنه, both of whom were present at Khaybar. ʿAlī himself said later: 'My eye never pained me since that day.'",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 4210 (detailed account)",
      "Ṣaḥīḥ al-Bukhārī 2942, 3009, 3701",
      "Ṣaḥīḥ Muslim 2406 (complete version, agreed upon)",
    ],
  },
  {
    title: "The Camel That Complained",
    story:
      "The Prophet ﷺ entered an orchard of one of the Anṣār. A camel saw him, approached, moaned, and his eyes shed tears. The Prophet ﷺ wiped behind its ears, and it calmed down. He then asked: 'Who owns this camel?' A young man came forward. The Prophet ﷺ said: 'Do you not fear Allah concerning this animal that Allah has given you to own? He complained to me that you starve him and overwork him.'",
    source: "Sunan Abī Dāwūd 2549",
    grading: "Ṣaḥīḥ (authenticated by al-Albānī)",
    historicalNotes:
      "Narrated by ʿAbdullāh ibn Jaʿfar رضي الله عنه. Similar incidents with a camel coming to the Prophet ﷺ in distress are reported. The authenticity of this specific chain was reviewed by modern hadith scholars including al-Albānī in Ṣaḥīḥ al-Jāmiʿ (hadith number 7034).",
    evidence: [
      "Sunan Abī Dāwūd 2549",
      "Musnad Aḥmad 1754",
      "Graded Ṣaḥīḥ by al-Albānī in Ṣaḥīḥ al-Jāmiʿ 7034",
    ],
  },
];

const whyThisMatters = [
  {
    title: "Miracles are a test of honesty, not of imagination",
    detail:
      "These events were witnessed by thousands of Companions. They were preserved through the most rigorous authentication process any tradition has developed. The question for the honest seeker is not 'could this happen?' but 'did these reports reliably reach us?' The chains of narration say yes.",
  },
  {
    title: "The Prophet ﷺ never used miracles to enrich himself",
    detail:
      "He never turned stones to gold. He died owning almost nothing. His food miracles fed his Companions, his water miracles served his army, his healing served the sick. Every miracle was for others, never for himself.",
  },
  {
    title: "The miracles match his character",
    detail:
      "A liar using false miracles would do so for power, wealth, or status. He had none of these things until very late in his life, and even then remained with the lifestyle of the poor. His miracles, like his teachings, were consistent with who he was before and during prophethood.",
  },
];

const caveats = [
  {
    problem: "Inventing new 'miracles' without hadith evidence",
    solution:
      "Some popular books and speakers recount miracles not found in the authenticated collections. Stick to what is recorded in Ṣaḥīḥ al-Bukhārī, Ṣaḥīḥ Muslim, and the other major collections with sound chains. Weak miracle narrations have been collected too, but they do not carry the same weight.",
  },
  {
    problem: "Focusing on miracles while missing the message",
    solution:
      "The Prophet ﷺ himself often directed attention away from physical miracles and toward the Qur'an. When Quraysh demanded more miracles, the Qur'an responded: 'Is it not enough for them that We revealed to you the Book that is recited to them?' (Al-ʿAnkabūt 29:51). The greatest miracle is the Book itself.",
  },
  {
    problem: "Conflating miracle with magic or trick",
    solution:
      "A miracle (muʿjizah) in Islam is an act only Allah can do, shown through a prophet. Magic (siḥr) is the human manipulation of unseen forces, which is condemned. The moon splitting is not the same category as a street magician's illusion, and the Qur'an explicitly rejects the comparison.",
  },
];

const faq = [
  {
    q: "Why is the Qur'an considered the greatest miracle?",
    a: "The physical miracles of the Prophet ﷺ were witnessed by the Companions of his time and preserved through their reports. The Qur'an is an ongoing, present-tense miracle that anyone today can verify: its linguistic inimitability, its preservation across 14 centuries, its prophetic fulfillments, and its internal consistency. Every other prophet's physical miracles ended with them; the Qur'an's miracle continues.",
  },
  {
    q: "Did anyone deny these miracles happened?",
    a: "Quraysh denied they were from Allah, but they did not generally deny the events occurred. They called them 'magic' (Al-Qamar 54:2 documents their response to the moon splitting). The Qur'an addressed their reaction rather than their denial of the event itself. Denying an event witnessed by so many would have been easy to refute; denying the source was their only angle.",
  },
  {
    q: "How can we be sure these hadith are authentic?",
    a: "Each hadith cited on this page was recorded through multiple independent chains of narrators, each evaluated by hadith scholars for integrity, memory, and reliability. Bukhārī and Muslim have the most stringent acceptance criteria. A hadith graded ṣaḥīḥ (authentic) in these works has passed this review. Verify any citation yourself on sunnah.com or in the original collections.",
  },
  {
    q: "Why don't we see miracles today?",
    a: "Miracles (muʿjizāt) in the technical sense accompany prophets to confirm their message. There are no more prophets after Muhammad ﷺ, so that specific category of miracle ended with him. However, the Qur'an as a miracle continues, and Allah continues to answer the duʿāʾ of believers in remarkable ways. That is not the same as a prophetic miracle, but it is the continuing mercy of Allah.",
  },
  {
    q: "What about miracles of other prophets?",
    a: "The Qur'an describes the miracles of previous prophets including Mūsā (staff turning to a serpent, parting the sea), ʿĪsā (healing the blind and lepers, giving life to the dead by Allah's permission), Ibrāhīm (surviving the fire), Sulaymān (commanding the wind and understanding animals), and others. These are affirmed as historical truths in Islamic belief. The Prophet Muhammad's ﷺ miracles are the capstone of this prophetic tradition.",
  },
  {
    q: "Where can I study more about the Prophet's miracles?",
    a: "Classical: al-Bayhaqī's Dalāʾil an-Nubuwwah (Signs of Prophethood) is the most comprehensive compilation. Ibn Kathīr's Al-Bidāyah wan-Nihāyah documents miracles in their historical context. Modern: 'Miracles and Merits of Allah's Messenger' in our library. Primary sources: Ṣaḥīḥ al-Bukhārī and Ṣaḥīḥ Muslim have extensive sections on the Prophet's ﷺ signs and virtues.",
  },
];

const related = [
  {
    href: "/why-islam/proving-islam",
    title: "Proving Islam Hub",
    description: "Back to the overview of evidences for Islam.",
  },
  {
    href: "/why-islam/proving-islam/prophecies",
    title: "Prophecies",
    description: "Specific predictions in the Qur'an and Sunnah that came true.",
  },
  {
    href: "/books/islamic-history/miracles-merits-of-allah-s-messenger-1776672921538-yag",
    title: "Miracles & Merits",
    description: "The library book compiling the authentic miracles.",
  },
  {
    href: "/guides/seerah",
    title: "Seerah Guide",
    description: "The life of the Prophet ﷺ in which these miracles occurred.",
  },
];

export const metadata = {
  title: "Miracles",
  description:
    "Authentic, sourced accounts of the miracles given to the Prophet Muhammad ﷺ by Allah: the splitting of the moon, the Night Journey, water from his fingers, food multiplying, and more.",
};

export default function MiraclesPage() {
  return (
    <>
      <ContentHeader
        title="Miracles"
        subtitle="Extraordinary signs given to the Prophet ﷺ, preserved through authentic hadith"
        breadcrumbs={[
          { label: "Why Islam", href: "/why-islam" },
          { label: "Proving Islam", href: "/why-islam/proving-islam" },
          { label: "Miracles" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            The Case From Miracles
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Every prophet sent by Allah was supported with miracles, because
            miracles are a sign only Allah can provide. The Prophet Muhammad ﷺ
            was supported with many. Each one below is drawn from authentic
            hadith collections, cited with its source and grading. No folk
            tales. Just what is preserved through reliable chains of
            transmission.
          </p>
        </div>

        {/* Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {motivation.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-l-4 border-teal-700"
            >
              <p className="text-gray-700 italic text-sm leading-relaxed">
                &ldquo;{m.text}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-2">{m.source}</p>
            </div>
          ))}
        </div>

        {/* What is a miracle */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What Counts as a Miracle in Islam
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Before looking at the specific miracles, it helps to understand
            what the word means.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whatIsAMiracle.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {w.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* For the Skeptic */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Search size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              For the Open-Minded Skeptic
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Miracles are harder to evaluate than prophecies because the events
            were not usually recorded outside of Islamic sources. Here is the
            honest case.
          </p>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex items-start gap-3 mb-4">
              <Scale
                size={20}
                className="text-teal-700 shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-base font-bold text-teal-900 mb-1">
                  The honest acknowledgment
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Most miracles on this page were witnessed in 7th-century
                  Arabia, a place not well-covered by outside historians at
                  the time. Unlike the fall of Constantinople or the Battle of
                  Nineveh, we do not have Byzantine or Persian chronicles
                  confirming the moon splitting or water from the
                  Prophet&apos;s ﷺ fingers. So how should a skeptic evaluate
                  these accounts?
                </p>
              </div>
            </div>

            <div className="space-y-4 md:pl-10">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Consideration 1
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  These reports come from multiple independent chains
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The splitting of the moon is narrated by Ibn Masʿūd, Anas,
                  Ibn ʿAbbās, and Jubayr ibn Muṭʿim رضي الله عنهم, four
                  Companions who did not coordinate. The palm tree crying is
                  narrated by over ten Companions through dozens of chains,
                  reaching the level called tawātur (mass transmission) in
                  hadith science. Mass transmission of an invented story is
                  considered impossible unless the witnesses collectively
                  conspired, which requires evidence of its own.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Consideration 2
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  Hostile witnesses did not deny the events
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Quraysh of Makkah were bitter enemies of the Prophet ﷺ.
                  They had every reason to publicly deny the moon splitting
                  ever happened. Instead, the Qur&apos;an records their
                  response: &ldquo;They say: this is magic continuing&rdquo;
                  (Al-Qamar 54:2). They changed the interpretation, not the
                  event. If the event had not happened, the trivial refutation
                  would have been to deny it. They did not.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Consideration 3
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  The hadith collections were compiled under criticism
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Imam al-Bukhārī and Imam Muslim did not collect stories
                  uncritically. They developed a whole science of narrator
                  criticism (ʿilm ar-rijāl) that evaluated the life, memory,
                  and reliability of every person in every chain. They
                  rejected thousands of narrations that others accepted.
                  Academic non-Muslim scholars of hadith, like Jonathan Brown
                  (Georgetown), acknowledge the rigor of this system, even
                  without accepting its theological conclusions.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Consideration 4
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  The Prophet&apos;s ﷺ character can be evaluated separately
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Even non-Muslim historians, from Michael Hart to Karen
                  Armstrong, acknowledge Muhammad ﷺ as an exceptional
                  historical figure of honesty, discipline, and consistency.
                  If we accept he was neither a liar nor mentally ill (both
                  supported by the total absence of lying or instability in
                  the extensive records of his life), then his own firsthand
                  claim to have experienced these miracles becomes a serious
                  data point on its own. This is the argument sometimes called
                  the &ldquo;prophet, not liar, not lunatic&rdquo; framework.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-teal-900 text-white rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-playfair)]">
              What remains to explain
            </h3>
            <p className="text-sm text-teal-100 leading-relaxed mb-3">
              Given the mass transmission, the silence of hostile witnesses,
              the rigor of the hadith sciences, and the Prophet&apos;s ﷺ own
              character: a skeptic is left with four options:
            </p>
            <ul className="space-y-1.5 text-sm text-teal-100">
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">1.</span>
                <span>
                  Thousands of Companions fabricated the same stories. This
                  requires a conspiracy with no evidence.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">2.</span>
                <span>
                  Mass hallucination over decades, across different locations
                  and Companions. This is not how hallucinations work.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">3.</span>
                <span>
                  The Prophet ﷺ was lying and thousands of honest people
                  confirmed the lies. This contradicts his character as
                  recorded by allies and opponents.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">4.</span>
                <span>
                  The events actually happened, and they happened through
                  something beyond human capability. This is the Islamic claim.
                </span>
              </li>
            </ul>
            <p className="text-sm text-teal-100 leading-relaxed mt-3">
              The miracles do not force anyone to believe. They raise a
              question that deserves a real answer, not a dismissive one.
            </p>
          </div>
        </div>

        {/* TABS: the main content */}
        <MiraclesTabs quranic={quranicMiracles} physical={physicalMiracles} />

        {/* The greatest miracle - callout */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <BookOpen size={36} className="text-teal-200 mx-auto mb-3" />
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            The greatest miracle is{" "}
            <span className="text-teal-200">the Qur&apos;an</span> itself.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed mb-4">
            The physical miracles on this page ended with the Companions who
            saw them. The Qur&apos;an is an ongoing miracle: its linguistic
            inimitability, its perfect preservation, its fulfilled prophecies,
            all present and testable today.
          </p>
          <Link
            href="/why-islam/proving-islam"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            See all evidences <ArrowRight size={14} />
          </Link>
        </div>

        {/* Why this matters */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              What These Miracles Tell Us
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Reading the evidence fairly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyThisMatters.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2
                    size={18}
                    className="text-teal-700 shrink-0 mt-0.5"
                  />
                  <h3 className="text-base font-bold text-teal-900">
                    {w.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {w.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Caveats */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Where Students of This Topic Go Wrong
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Important cautions. Overreach weakens the case.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caveats.map((c) => (
              <div
                key={c.problem}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-rose-500" />
                  <h3 className="text-sm font-bold text-teal-900">
                    {c.problem}
                  </h3>
                </div>
                <div className="flex items-start gap-2 mt-3 bg-emerald-50/60 rounded-xl p-3">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {c.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verify callout */}
        <div className="mb-12 bg-teal-50 border-l-4 border-teal-700 rounded-2xl p-5 flex items-start gap-3">
          <Info size={20} className="text-teal-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-teal-900 mb-1">
              Verify before citing
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              Every miracle on this page lists its source (Bukhārī, Muslim,
              Tirmidhī, etc.) and grading. Before sharing these with others,
              look them up yourself on sunnah.com or in the printed
              collections. The case is strong precisely because it rests on
              verifiable, authenticated transmission.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Common Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 items-start">
            {faq.map((f, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] group"
              >
                <summary className="font-semibold text-teal-900 cursor-pointer list-none flex items-start justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-teal-700 group-open:rotate-45 transition-transform duration-200 text-xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Related */}
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-6 font-[family-name:var(--font-playfair)]">
            Continue Learning
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                    {r.title}
                  </h3>
                  <ArrowRight
                    size={18}
                    className="text-teal-700 group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
