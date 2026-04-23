import Link from "next/link";
import { ContentHeader } from "@/components/content-header";
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  HelpCircle,
  Layers,
  Search,
  Scale,
} from "lucide-react";
import {
  PropheciesTabs,
  type QuranicProphecy,
  type HadithProphecy,
} from "./prophecies-tabs";

const motivation = [
  {
    text: "And this is a Book We have sent down, blessed. So follow it and fear Allah that you may receive mercy.",
    source: "Surah Al-Anʿām 6:155",
  },
  {
    text: "Nor does he speak from his own desire. It is not but a revelation revealed.",
    source: "Surah An-Najm 53:3-4",
  },
  {
    text: "Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian.",
    source: "Surah Al-Ḥijr 15:9",
  },
];

const types = [
  {
    title: "Qur'anic Prophecies",
    description:
      "Predictions made directly in the Qur'an about future events: the victory of armies, the entry into a city, the fate of specific individuals, and the preservation of the Qur'an itself.",
  },
  {
    title: "Prophetic Prophecies",
    description:
      "Predictions made by the Prophet Muhammad ﷺ in authentic hadith about future conquests, political changes, signs of the end times, and events concerning specific people.",
  },
];

const quranicProphecies: QuranicProphecy[] = [
  {
    title: "The Byzantine Return to Victory",
    verse: "Sūrah Ar-Rūm 30:1-4",
    arabic:
      "الٓمٓ ﴿١﴾ غُلِبَتِ ٱلرُّومُ ﴿٢﴾ فِىٓ أَدْنَى ٱلْأَرْضِ وَهُم مِّنۢ بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ﴿٣﴾ فِى بِضْعِ سِنِينَ ۗ لِلَّهِ ٱلْأَمْرُ مِن قَبْلُ وَمِنۢ بَعْدُ ۚ وَيَوْمَئِذٍ يَفْرَحُ ٱلْمُؤْمِنُونَ ﴿٤﴾",
    translation:
      "Alif, Lām, Mīm. The Byzantines have been defeated, in the nearest land. But they, after their defeat, will overcome within three to nine years. To Allah belongs the command before and after. And on that day, the believers will rejoice.",
    context:
      "Revealed in Makkah, approximately 614 to 615 CE, shortly after the Sasanian Persian Empire defeated the Byzantines and captured Jerusalem in 614 CE. At the time, the Persians looked unstoppable. The Byzantines had lost their major cities, their True Cross had been taken as war booty, and they were considered a finished power. The polytheists of Makkah openly mocked the believers, saying: the Persians (fire-worshippers) defeated the Byzantines (People of the Book), just as we Quraysh will defeat you.",
    fulfillment:
      "The Arabic word biḍʿ (بضع) specifically means three to nine years. Exactly within this window, in 624 CE (around the same time as the Battle of Badr), Byzantine emperor Heraclius launched a decisive counter-offensive. By 627 CE, at the Battle of Nineveh, the Persian army was shattered. By 628 CE, the Persian emperor Khosrow II was deposed and killed, the Persian Empire was effectively destroyed, and the True Cross was returned to Jerusalem. A complete reversal of the 614 situation, within the stated timeframe.",
    scholarlyNotes:
      "Ibn Kathīr notes in his tafsīr that Abū Bakr as-Ṣiddīq رضي الله عنه accepted a wager from the Makkan Ubayy ibn Khalaf on the outcome (before gambling was forbidden), staking camels on the Byzantines winning within a certain number of years. After bid' was clarified by the Prophet ﷺ, Abū Bakr renegotiated the terms and eventually collected 100 camels when the prophecy was fulfilled. This event is recorded in Tirmidhī, Musnad Aḥmad, and the major tafāsīr.",
    evidence: [
      "Tafsīr Ibn Kathīr, commentary on Sūrah Ar-Rūm 30:1-4",
      "Tafsīr aṭ-Ṭabarī, Jāmiʿ al-Bayān on Ar-Rūm",
      "Jāmiʿ at-Tirmidhī 3193 (the account of Abū Bakr's wager)",
      "Historical records: Battle of Nineveh (627 CE), Treaty of 628 CE between Heraclius and Kavadh II",
      "The Oxford History of Byzantium, on the Heraclian dynasty's counter-offensive",
    ],
  },
  {
    title: "The Peaceful Entry into Makkah",
    verse: "Sūrah Al-Fatḥ 48:27",
    arabic:
      "لَّقَدْ صَدَقَ ٱللَّهُ رَسُولَهُ ٱلرُّءْيَا بِٱلْحَقِّ ۖ لَتَدْخُلُنَّ ٱلْمَسْجِدَ ٱلْحَرَامَ إِن شَآءَ ٱللَّهُ ءَامِنِينَ مُحَلِّقِينَ رُءُوسَكُمْ وَمُقَصِّرِينَ لَا تَخَافُونَ ۖ فَعَلِمَ مَا لَمْ تَعْلَمُوا۟ فَجَعَلَ مِن دُونِ ذَٰلِكَ فَتْحًا قَرِيبًا ﴿٢٧﴾",
    translation:
      "Allah has certainly fulfilled His Messenger's vision in truth. You will surely enter al-Masjid al-Ḥarām, if Allah wills, in safety, with your heads shaved and hair shortened, not fearing. He knew what you did not know and granted besides that a near victory.",
    context:
      "Revealed immediately after the Treaty of Ḥudaybiyyah in Dhū al-Qaʿdah 6 AH (March 628 CE). The Prophet ﷺ had seen a vision of performing ʿUmrah in Makkah, but on the way he was stopped at Ḥudaybiyyah and forced to sign a treaty that required him to turn back without entering the Kaʿbah that year. Many Companions were deeply disappointed. The verse was revealed to affirm that the vision was true and would be fulfilled.",
    fulfillment:
      "The prophecy was fulfilled in two stages. First, in Dhū al-Qaʿdah 7 AH (March 629 CE), the Prophet ﷺ and the Companions entered Makkah peacefully to perform ʿUmrat al-Qaḍāʾ (the compensatory ʿUmrah). They shaved and shortened their hair exactly as the verse described. Second, in Ramaḍān 8 AH (January 630 CE), Makkah was opened peacefully when the Prophet ﷺ entered with 10,000 Companions. The city that had expelled him surrendered without battle.",
    scholarlyNotes:
      "Ibn Hishām's Sīrah and Ibn Kathīr's tafsīr both detail the revelation context. Classical mufassirūn note the precise wording: 'muḥalliqīna ruʾūsakum wa muqaṣṣirīn' specifies the ritual actions of the pilgrim at the end of ʿUmrah. No person in 6 AH could predict a peaceful entry would happen with a battle-free Conquest of Makkah just two years later. The 'near victory' mentioned in the same verse is understood by many scholars as the Battle of Khaybar (7 AH), which happened shortly after Ḥudaybiyyah.",
    evidence: [
      "Tafsīr Ibn Kathīr, commentary on Al-Fatḥ 48:27",
      "Ibn Hishām's Sīrat an-Nabawiyyah, narrative of Ḥudaybiyyah and ʿUmrat al-Qaḍāʾ",
      "Ṣaḥīḥ al-Bukhārī, Kitāb al-Maghāzī (Book of Military Expeditions), chapters on Ḥudaybiyyah",
      "Ar-Raḥīq al-Makhtūm (The Sealed Nectar) by al-Mubārakpūrī",
      "Classical seerah timeline: Ḥudaybiyyah 6 AH, ʿUmrat al-Qaḍāʾ 7 AH, Fatḥ Makkah 8 AH",
    ],
  },
  {
    title: "The Fate of Abū Lahab",
    verse: "Sūrah Al-Masad 111:1-5",
    arabic:
      "تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ ﴿١﴾ مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ ﴿٢﴾ سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ﴿٣﴾ وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ ﴿٤﴾ فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ ﴿٥﴾",
    translation:
      "May the hands of Abū Lahab be ruined, and he is ruined. His wealth will not avail him, nor what he earned. He will enter a Fire of blazing flames. And his wife, carrier of firewood, around her neck a rope of twisted palm fiber.",
    context:
      "Revealed in the early Makkan period after Abū Lahab (the Prophet's ﷺ own uncle, whose real name was ʿAbd al-ʿUzzā ibn ʿAbd al-Muṭṭalib) publicly cursed the Prophet ﷺ when he first called the Quraysh openly to Islam at the foot of Mount Ṣafā, saying 'tabban laka' (may you be ruined). The sūrah responded by naming him directly and declaring his final state: death as a disbeliever and entry into the Fire.",
    fulfillment:
      "Abū Lahab had approximately ten years between the revelation of this sūrah and his death. At any point in those ten years he could have publicly said 'I believe in Muḥammad ﷺ', even insincerely, and broken the prophecy. He never did. He remained a bitter enemy of Islam to the end and died of a disease called al-ʿAdasah (a boil-like infection, likely a form of plague) shortly after the Battle of Badr in 2 AH. His wife Umm Jamīl also died as a disbeliever.",
    scholarlyNotes:
      "This is one of the most striking falsifiable prophecies in the Qur'an. Any opponent of Islam could have pointed to it and said: 'We need only get Abū Lahab to say the shahādah.' The Qur'an was essentially staking its divine origin on the behaviour of a specific living hostile individual. Ibn Kathīr and as-Suyūṭī discuss this in detail. Shaykh Aḥmad Deedat and others in modern times have highlighted this as one of the most persuasive evidences of the Qur'an's divine source.",
    evidence: [
      "Tafsīr Ibn Kathīr, commentary on Sūrah Al-Masad",
      "Asbāb an-Nuzūl by al-Wāḥidī, circumstances of revelation",
      "Ṣaḥīḥ al-Bukhārī 1394 (the account of the Prophet ﷺ calling Quraysh from Mount Ṣafā and Abū Lahab's response)",
      "Sīrat Ibn Hishām, on Abū Lahab's death after Badr",
      "Modern discussions: Deedat's The Choice, vol. 1",
    ],
  },
  {
    title: "The Preservation of the Qur'an",
    verse: "Sūrah Al-Ḥijr 15:9",
    arabic:
      "إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ ﴿٩﴾",
    translation:
      "Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian.",
    context:
      "Revealed in the late Makkan period, at a time when the Qur'an existed primarily as memorized recitation among a small community of believers. Previous revealed scriptures (the Torah, the Psalms, the Gospel) had been lost, altered, or scattered over centuries. Allah declared the Qur'an would not share that fate.",
    fulfillment:
      "Over 1,400 years later, the Qur'an is identical across the Muslim world: Morocco to Indonesia, Senegal to Malaysia. It is memorized cover to cover by millions of Muslims in every generation. Manuscripts from the first and second Islamic centuries (such as the Ṣanʿāʾ manuscript, the Tübingen manuscript, and the Birmingham Qur'an) match modern printings in their text. Non-Muslim academic scholars of early Islam acknowledge this level of preservation as unparalleled for any ancient text of comparable age.",
    scholarlyNotes:
      "ʿUthmān ibn ʿAffān رضي الله عنه standardized the written copy in approximately 25 AH, sending identical master copies to the major Muslim cities. Every copy since is traced to this. The Mushaf is preserved in two ways simultaneously: written text and oral recitation with chains (isnād) of memorization. Both methods have operated as a double check on each other for fourteen centuries.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 4987 (the compilation of the Qur'an under ʿUthmān رضي الله عنه)",
      "The Ṣanʿāʾ manuscript (ca. 1st century AH), studied at the Ṣanʿāʾ Great Mosque",
      "The Birmingham Qur'an manuscript (radiocarbon dated to 568-645 CE, within or shortly after the Prophet's ﷺ lifetime)",
      "Academic studies: 'The Codex of a Companion of the Prophet and the Quran of the Prophet' by Asma Hilali, and others",
      "Tafsīr al-Qurṭubī on Al-Ḥijr 15:9",
    ],
  },
];

const propheticProphecies: HadithProphecy[] = [
  {
    title: "The Fall of Persia and the Treasures of Chosroes",
    arabic:
      "وَلَئِنْ طَالَتْ بِكَ حَيَاةٌ لَتُفْتَحَنَّ كُنُوزُ كِسْرَى",
    statement:
      "The Prophet ﷺ told ʿAdī ibn Ḥātim (رضي الله عنه): 'If you live long enough, the treasures of Chosroes (the Sasanian Persian emperor) will be opened for you.' ʿAdī replied: 'Chosroes son of Hormuz?' The Prophet ﷺ said: 'Yes, Chosroes son of Hormuz.' At the time of this statement, the Muslims were a small, hungry community in Madīnah.",
    source: "Ṣaḥīḥ al-Bukhārī 3595",
    grading: "Ṣaḥīḥ (highest)",
    fulfillment:
      "Within approximately 20 years of the Prophet's ﷺ passing, during the caliphate of ʿUmar ibn al-Khaṭṭāb رضي الله عنه, the Sasanian Persian Empire had fallen. The decisive battles were al-Qādisiyyah (15 AH / 636 CE) and Nahāwand (21 AH / 642 CE). The treasures of Chosroes were physically transported to Madīnah. ʿAdī ibn Ḥātim himself lived to see this and said 'I have seen the first [prophecy about the woman traveling safely from Ḥīrah to the Kaʿbah], and I will live to see the third [the treasures of Chosroes being distributed].'",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3595 (also 3612 and 3618 in some editions)",
      "The History of al-Ṭabarī, volumes on the conquest of Persia",
      "Battle of al-Qādisiyyah (15 AH / 636 CE): standard historical record",
      "Battle of Nahāwand (21 AH / 642 CE): effective end of Sasanian Empire",
    ],
  },
  {
    title: "The Conquest of Constantinople",
    arabic:
      "لَتُفْتَحَنَّ الْقُسْطَنْطِينِيَّةُ فَلَنِعْمَ الْأَمِيرُ أَمِيرُهَا وَلَنِعْمَ الْجَيْشُ ذَلِكَ الْجَيْشُ",
    statement:
      "The Prophet ﷺ said: 'Constantinople will certainly be conquered. What an excellent leader will her leader be, and what an excellent army will that army be.' At the time, Constantinople was the capital of the Eastern Roman Empire and the most fortified city in the known world.",
    source: "Musnad Aḥmad 18957, al-Mustadrak by al-Ḥākim",
    grading: "Ṣaḥīḥ (authenticated)",
    fulfillment:
      "Constantinople (modern Istanbul) fell on 29 May 1453 CE to Sultan Mehmed II, later known as Mehmed Fātiḥ ('the Conqueror'), at the age of 21. He led the Ottoman army across the double walls that had held for a thousand years. The city had been besieged and attacked many times by Muslim armies over the preceding centuries, each attempt failing, until Mehmed succeeded approximately 826 years after the Prophet's ﷺ statement. The prophecy named no date, no leader, no empire, only that it would happen and the leader and army would be excellent.",
    evidence: [
      "Musnad Aḥmad 18957",
      "Al-Mustadrak by al-Ḥākim, who stated the chain meets the criteria of Bukhārī and Muslim",
      "Graded Ṣaḥīḥ by Shaykh Aḥmad Shākir in his Musnad commentary",
      "Graded Ṣaḥīḥ by al-Albānī in Silsilat al-Aḥādīth aṣ-Ṣaḥīḥah, number 4",
      "Historical event: Fall of Constantinople, 29 May 1453 CE, widely documented",
    ],
  },
  {
    title: "A Woman Traveling Safely from Ḥīrah to the Kaʿbah",
    arabic:
      "إِنْ طَالَتْ بِكَ حَيَاةٌ لَتَرَيَنَّ الظَّعِينَةَ تَرْتَحِلُ مِنَ الْحِيرَةِ حَتَّى تَطُوفَ بِالْكَعْبَةِ لَا تَخَافُ أَحَدًا إِلَّا اللَّهَ",
    statement:
      "In the same conversation with ʿAdī ibn Ḥātim رضي الله عنه, the Prophet ﷺ said: 'If you live long enough, you will see a woman traveling from Ḥīrah (in modern Iraq) until she circumambulates the Kaʿbah, fearing no one except Allah.' At the time, the Arabian Peninsula was in tribal warfare, and safe travel for a woman alone across that distance was unthinkable.",
    source: "Ṣaḥīḥ al-Bukhārī 3595",
    grading: "Ṣaḥīḥ (highest)",
    fulfillment:
      "ʿAdī ibn Ḥātim lived to see this during the caliphate of ʿUmar ibn al-Khaṭṭāb رضي الله عنه and afterwards, when the Muslim state had established such security that lone travelers, including women, could cross the formerly lawless peninsula in safety. He testified personally to this fulfillment.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 3595 (same narration as the Persian treasures prophecy)",
      "ʿAdī ibn Ḥātim's own testimony, recorded in the same hadith",
    ],
  },
];

const signsOfTheHour: HadithProphecy[] = [
  {
    title: "Shepherds Competing in Tall Buildings",
    arabic:
      "أَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ",
    statement:
      "In the famous Ḥadīth of Jibrīl, the angel Jibrīl asked the Prophet ﷺ about the signs of the Hour. Among the signs the Prophet ﷺ mentioned: 'That you will see the barefoot, naked, destitute shepherds competing in the construction of tall buildings.' He was specifically describing the people of the Arabian Peninsula.",
    source: "Ṣaḥīḥ Muslim 8, Ṣaḥīḥ al-Bukhārī 50",
    grading: "Ṣaḥīḥ (highest, agreed upon)",
    fulfillment:
      "Within the last century, the Arabian Peninsula, historically one of the poorest and most undeveloped regions on earth with a population that was largely Bedouin shepherds, has become home to many of the tallest buildings ever built. The Burj Khalifa in Dubai (828 m, completed 2010), the Makkah Royal Clock Tower (601 m, completed 2012), the Kingdom Tower in Jeddah (under construction, planned over 1 km), and dozens of others. The change from shepherds to skyscrapers happened within living memory.",
    evidence: [
      "Ṣaḥīḥ Muslim 8 (Hadith of Jibrīl, full text)",
      "Ṣaḥīḥ al-Bukhārī 50 (shorter version)",
      "Ṣaḥīḥ al-Bukhārī 4777 (longer version)",
      "Visible in the present-day skylines of Dubai, Riyadh, and Makkah",
    ],
  },
  {
    title: "Time Passing Quickly",
    arabic:
      "لَا تَقُومُ السَّاعَةُ حَتَّى يَتَقَارَبَ الزَّمَانُ فَتَكُونَ السَّنَةُ كَالشَّهْرِ وَيَكُونَ الشَّهْرُ كَالْجُمُعَةِ وَتَكُونَ الْجُمُعَةُ كَالْيَوْمِ",
    statement:
      "The Prophet ﷺ said: 'The Hour will not be established until time passes quickly. A year will be like a month, a month will be like a week, a week will be like a day, a day will be like an hour, and an hour will be like the burning of a palm branch.'",
    source: "Musnad Aḥmad 10560, Jāmiʿ at-Tirmidhī 2332",
    grading: "Ḥasan (good)",
    fulfillment:
      "Scholars have understood this in several complementary ways. One clear sense is the subjective experience of time in the modern era: weeks and years feel compressed in a way previous generations did not describe. Another is the physical speed of communication and travel: information that took months now takes seconds; journeys that took weeks now take hours. Another is the erosion of barakah (spiritual blessing) in time, where long days disappear without yielding their traditional output. All three interpretations are visible now in a way they were not in earlier centuries.",
    evidence: [
      "Musnad Aḥmad 10560, graded ḥasan by Aḥmad Shākir",
      "Jāmiʿ at-Tirmidhī 2332, graded ḥasan ṣaḥīḥ",
      "Silsilat al-Aḥādīth aṣ-Ṣaḥīḥah by al-Albānī, number 2940",
      "Classical commentary: al-Manāwī in Fayḍ al-Qadīr discusses multiple interpretations",
    ],
  },
  {
    title: "Knowledge Being Lifted Through the Death of Scholars",
    arabic:
      "إِنَّ اللَّهَ لَا يَقْبِضُ الْعِلْمَ انْتِزَاعًا يَنْتَزِعُهُ مِنَ الْعِبَادِ وَلَكِنْ يَقْبِضُ الْعِلْمَ بِقَبْضِ الْعُلَمَاءِ",
    statement:
      "The Prophet ﷺ said: 'Allah does not take knowledge away by snatching it from people, but He takes it away by the death of the scholars. When no scholar is left, people take ignorant leaders, who are asked questions and give rulings without knowledge. They go astray themselves and lead others astray.'",
    source: "Ṣaḥīḥ al-Bukhārī 100, Ṣaḥīḥ Muslim 2673",
    grading: "Ṣaḥīḥ (highest, agreed upon)",
    fulfillment:
      "Every generation sees some of this, but the modern era is often described by scholars as a time of intense scholarly loss. Great muḥaddithūn, mufassirūn, and fuqahāʾ have passed without peers of their stature replacing them. Meanwhile, unqualified figures issue rulings online, reaching millions, without the training that historically was required before one even spoke on a religious matter.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 100",
      "Ṣaḥīḥ Muslim 2673",
      "Sunan Ibn Mājah 52",
      "Jāmiʿ at-Tirmidhī 2652",
    ],
  },
  {
    title: "Tribulations, Killing, and Loss of Trust",
    arabic:
      "لَا تَقُومُ السَّاعَةُ حَتَّى يَقِلَّ الْعِلْمُ وَتَظْهَرَ الْفِتَنُ وَيَتَقَارَبَ الزَّمَانُ وَيَكْثُرَ الْهَرْجُ",
    statement:
      "The Prophet ﷺ said: 'The Hour will not be established until knowledge decreases, earthquakes increase, fitan (tribulations) appear, and harj (mass killing) increases.'",
    source: "Ṣaḥīḥ al-Bukhārī 1036, Ṣaḥīḥ Muslim 157",
    grading: "Ṣaḥīḥ (highest, agreed upon)",
    fulfillment:
      "The 20th and 21st centuries have seen unprecedented numbers of deaths in wars (two World Wars, multiple genocides, ongoing conflicts), widespread political and social tribulations, an increase in recorded earthquakes, and a documented decline in religious knowledge in many Muslim-majority societies. The convergence of all these signs in one era matches the hadith's description.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 1036",
      "Ṣaḥīḥ Muslim 157",
      "Ṣaḥīḥ al-Bukhārī 85 (separate narration on the increase of killing)",
    ],
  },
  {
    title: "The Euphrates Uncovering a Mountain of Gold",
    arabic:
      "لَا تَقُومُ السَّاعَةُ حَتَّى يَحْسِرَ الْفُرَاتُ عَنْ جَبَلٍ مِنْ ذَهَبٍ",
    statement:
      "The Prophet ﷺ said: 'The Hour will not be established until the Euphrates uncovers a mountain of gold, over which people will fight. Ninety-nine out of every hundred will die, and every man among them will say: Perhaps I will be the one who survives.'",
    source: "Ṣaḥīḥ al-Bukhārī 7119, Ṣaḥīḥ Muslim 2894",
    grading: "Ṣaḥīḥ (highest, agreed upon)",
    fulfillment:
      "This prophecy has not yet been fulfilled in the manner described. It is listed as a future sign the Prophet ﷺ informed us about. Some scholars note the Euphrates has been significantly receding in modern decades, and some have speculated about oil or mineral discoveries, but the specific 'mountain of gold' has not appeared. The hadith teaches patience, restraint, and warning against greed when the test comes.",
    evidence: [
      "Ṣaḥīḥ al-Bukhārī 7119",
      "Ṣaḥīḥ Muslim 2894",
      "Classical commentaries by Ibn Ḥajar in Fatḥ al-Bārī",
    ],
  },
];

const caveats = [
  {
    problem: "Reading modern science into vague verses",
    solution:
      "A rigorous case for Islam does not require forcing scientific theories into classical Arabic metaphors. The strongest prophecies are already specific, falsifiable, and fulfilled. Avoid the popular 'scientific miracles' claims that rest on reading 21st-century science back into 7th-century Arabic vocabulary.",
  },
  {
    problem: "Using weak or fabricated 'signs'",
    solution:
      "Some viral lists of fulfilled prophecies contain weak or forged narrations. Before citing a hadith, verify its grading on sunnah.com or a verified collection. Cite the collection and grade openly. Weak hadith about the unseen are particularly unreliable.",
  },
  {
    problem: "Claiming every world event fulfils a prophecy",
    solution:
      "Not every earthquake is the earthquakes in the hadith, not every building is the tall building, not every war is the harj. Be precise. A prophecy is fulfilled when the specific description matches what happened, not when anything vaguely reminiscent occurs.",
  },
  {
    problem: "Citing specific dates for the Hour itself",
    solution:
      "The Prophet ﷺ explicitly said that only Allah knows when the Hour will come. Any specific date or year attributed to the Hour is not from him. The signs are described; the timing is not.",
  },
];

const faq = [
  {
    q: "How can we be sure these prophecies weren't added after the events?",
    a: "The Qur'an was memorized and recited from the Prophet's ﷺ lifetime, then preserved in writing during the caliphate of Abū Bakr (12 AH) and standardized by ʿUthmān رضي الله عنهما around 25 AH. The master copies were distributed across the Muslim world and are traceable in manuscripts dating to the first and second Islamic centuries (the Ṣanʿāʾ manuscript, the Birmingham Qur'an, and others), all before the conquest of Constantinople (1453 CE) or most end-times prophecies. There was no opportunity to retroactively insert prophecies about future events.",
  },
  {
    q: "Could the Byzantine prophecy have been a lucky guess?",
    a: "In 614 CE, the Byzantines had just lost Jerusalem, their True Cross, their major eastern territories, and their economic base. Their emperor was barely holding together a collapsing state. No observer would have predicted their return to victory, let alone given a specific 3 to 9 year window. The Qur'an did both, and it happened. The specificity, the timing, and the fact that the believers in Makkah were being openly mocked over this very prediction makes it one of the strongest examples.",
  },
  {
    q: "What about hadith prophecies that seem to be happening now?",
    a: "Many of the 'minor signs' of the Hour (the ones that precede the Hour itself by a long period) were described by the Prophet ﷺ as gradual developments in society. Seeing them unfold in our time does not mean the Hour is imminent, but it does confirm the accuracy of the hadith. The major signs (the appearance of the Mahdī, the return of ʿĪsā peace be upon him, the Dajjāl, Yaʾjūj and Maʾjūj, the rising of the sun from the west) have not yet occurred, and will be unmistakable when they do.",
  },
  {
    q: "Why do some 'fulfilled prophecies' shared online seem questionable?",
    a: "Because they often are. Popular social media lists sometimes use weak, fabricated, or out-of-context narrations. A rigorous student of this topic only cites authentic hadith (ṣaḥīḥ or ḥasan graded by recognized scholars), and only claims fulfillment when the specific details match. If you come across a striking claim, verify the hadith's grade on sunnah.com or a verified collection before sharing.",
  },
  {
    q: "Does the hadith about a woman traveling from Ḥīrah count as fulfilled?",
    a: "Yes, and uniquely, ʿAdī ibn Ḥātim رضي الله عنه who heard the prophecy himself lived to witness it personally and testified to its fulfillment. He said he saw the first of the three things the Prophet ﷺ promised him (the woman traveling safely), lived to see the second (Muslim expansion), and expected to see the third (treasures of Chosroes). His own lifetime confirms two of the three explicitly.",
  },
  {
    q: "Where can I study this topic more deeply?",
    a: "Classical: al-Bayhaqī's Dalāʾil an-Nubuwwah (Signs of Prophethood) is the most comprehensive compilation. Ibn Kathīr's al-Bidāyah wan-Nihāyah documents fulfillment of many prophecies historically. Modern: Shaykh Yusuf al-Qaraḍāwī, Shaykh Sulayman al-ʿUwdah, and others have written on this topic. Sunnah.com, MuslimCentral, and classical tafsir works are starting points.",
  },
];

const related = [
  {
    href: "/why-islam/proving-islam",
    title: "Proving Islam Hub",
    description: "Back to the overview of evidences for Islam.",
  },
  {
    href: "/why-islam",
    title: "Why Islam",
    description: "The main introduction to Islam.",
  },
  {
    href: "/quran/tafseer",
    title: "Tafseer Resources",
    description: "Study the Qur'an's meaning in depth.",
  },
  {
    href: "/guides/seerah",
    title: "Seerah Guide",
    description: "The life of the Prophet ﷺ where these prophecies were made.",
  },
];

export const metadata = {
  title: "Prophecies",
  description:
    "Detailed, sourced evidence of fulfilled prophecies in the Qur'an and authentic hadith: the Byzantine victory, the conquest of Makkah, Abū Lahab, Constantinople, and signs of the Hour.",
};

export default function PropheciesPage() {
  return (
    <>
      <ContentHeader
        title="Prophecies"
        subtitle="Predictions made centuries before they came true, with the evidence"
        breadcrumbs={[
          { label: "Why Islam", href: "/why-islam" },
          { label: "Proving Islam", href: "/why-islam/proving-islam" },
          { label: "Prophecies" },
        ]}
      />

      <section className="max-w-6xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        {/* Intro */}
        <div className="bg-teal-100 rounded-2xl px-8 py-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-teal-900 mb-3 text-center font-[family-name:var(--font-playfair)]">
            The Case From Prophecy
          </h2>
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[19px] leading-[1.65] text-center">
            Knowledge of the future belongs to Allah alone. When a messenger
            accurately predicts specific, verifiable events before they occur,
            that is not coincidence; it is a sign. What follows is not a
            cherry-picked list. Every prophecy below is cited with its source,
            its hadith grading, and the historical record that confirmed it.
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

        {/* Two types of prophecies */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={22} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900 font-[family-name:var(--font-playfair)]">
              Two Sources of Prophecy
            </h2>
          </div>
          <p className="text-gray-500 mb-6">
            Islamic prophecy comes from two places: the Qur&apos;an itself, and
            the authenticated statements of the Prophet ﷺ. This page covers
            both, organized into three tabs below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {types.map((t) => (
              <div
                key={t.title}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-teal-900 mb-2">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t.description}
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
            A fair objection: &ldquo;You can&apos;t prove the Qur&apos;an
            using the Qur&apos;an.&rdquo; Agreed. Here is how these prophecies
            can be evaluated without assuming Islam is already true.
          </p>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-4">
            <div className="flex items-start gap-3 mb-4">
              <Scale
                size={20}
                className="text-teal-700 shrink-0 mt-0.5"
              />
              <div>
                <h3 className="text-base font-bold text-teal-900 mb-1">
                  The test has three steps
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A prophecy is only evidence for Islam if three things are
                  independently true. You can check each of these using
                  sources that have nothing to do with Islam.
                </p>
              </div>
            </div>

            <div className="space-y-4 md:pl-10">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Step 1
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  The Islamic text existed before the event
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Qur&apos;an is attested by manuscripts that predate many
                  of its prophetic fulfillments. The Birmingham Qur&apos;an
                  folios are carbon-dated to 568 to 645 CE, matching or
                  preceding the Prophet&apos;s ﷺ own lifetime. The
                  Ṣanʿāʾ manuscripts date to the first century AH. These are
                  studied and published in secular academic journals with no
                  Islamic bias. The same logic applies to the hadith: Musnad
                  Aḥmad was compiled around 241 AH (855 CE), over 600 years
                  before the fall of Constantinople.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Step 2
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  The event happened as described
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  These events are documented in non-Islamic sources. The
                  Battle of Nineveh (627 CE) is in Byzantine chronicles like
                  Theophanes the Confessor&apos;s Chronography. The fall of
                  the Sasanian Empire is in Persian and Byzantine records. The
                  Fall of Constantinople (1453 CE) is one of the most
                  thoroughly documented events in European history, recorded
                  by Byzantine, Ottoman, Italian, and many other sources. The
                  ʿUthmānī standardization of the Qur&apos;an (around 25 AH)
                  is confirmed by manuscript evidence and historical records.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Step 3
                </p>
                <h4 className="text-sm font-bold text-teal-900 mb-2">
                  The prediction was specific enough to count
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  &ldquo;Something good will happen eventually&rdquo; is not a
                  prophecy. &ldquo;The Byzantines will reverse their defeat and
                  win within three to nine years&rdquo; is a prophecy, because
                  it can be falsified if the Byzantines lose, fail to reverse,
                  or the window closes. The prophecies on this page were
                  specific in at least one of: timing, location, named
                  individuals, or outcome.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-teal-900 text-white rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-playfair)]">
              What the skeptic has to explain
            </h3>
            <p className="text-sm text-teal-100 leading-relaxed mb-3">
              If an old text makes a specific, falsifiable prediction, and
              history records the prediction being fulfilled, the skeptic is
              left with four options:
            </p>
            <ul className="space-y-1.5 text-sm text-teal-100">
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">1.</span>
                <span>
                  The prediction was inserted after the event. But the
                  manuscript evidence rules this out for most examples.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">2.</span>
                <span>
                  It was a lucky guess. But the specificity (named people,
                  timeframes, geographic locations) makes this statistically
                  implausible.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">3.</span>
                <span>
                  It was ordinary human insight. But some predictions involve
                  events 800 years into the future, beyond any human foresight.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-200 font-bold shrink-0">4.</span>
                <span>
                  Someone knew the future who was not bound by ordinary human
                  limits. This is the Islamic claim.
                </span>
              </li>
            </ul>
            <p className="text-sm text-teal-100 leading-relaxed mt-3">
              The prophecies on this page do not force anyone to accept Islam.
              They force the honest seeker to reckon with a specific
              explanation gap. The invitation is to take option four seriously.
            </p>
          </div>
        </div>

        {/* TABS: the main content */}
        <PropheciesTabs
          quranic={quranicProphecies}
          prophetic={propheticProphecies}
          signs={signsOfTheHour}
        />

        {/* What this proves */}
        <div className="mb-12 bg-teal-900 text-white rounded-2xl px-8 py-8 shadow-[0_4px_12px_rgba(0,0,0,0.12)] text-center">
          <Star size={36} className="text-teal-200 mx-auto mb-3" />
          <p className="text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-3">
            Knowledge of the unseen belongs to{" "}
            <span className="text-teal-200">Allah alone</span>.
          </p>
          <p className="text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
            When a messenger speaks specific, verifiable truths about the
            future that no human could know, it is a sign of who sent him.
            Each prophecy on this page is cited with its source, its chain,
            and the historical fulfillment. Verify for yourself, then judge.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Always verify before citing
            </h3>
            <p className="text-sm text-teal-900 leading-relaxed">
              Every prophecy on this page lists its source and grading. Before
              sharing any of these with others, look them up yourself on
              sunnah.com or in the printed collections. A prophecy you can
              defend calmly with evidence is more powerful than one you just
              forward.
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
