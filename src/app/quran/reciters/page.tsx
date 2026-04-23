import Image from "next/image";
import { ContentHeader } from "@/components/content-header";
import { ExternalLink } from "lucide-react";

const STORAGE_URL =
  "https://rmsaeculynliwrkvnibx.supabase.co/storage/v1/object/public/covers/reciters";

const reciters = [
  { name: "Sheikh Abdul Basit Abdus Samad", img: "Sheikh_Abdul_Basit_Abdus_Samad_Medium.jpeg", url: "https://youtube.com/playlist?list=PLepA_uo--t6Izcnfe5XgDNTB-gqrIAeeq&si=ge7Wbkz_9BxvuRKR" },
  { name: "Sheikh Abdul Rahman Al-Sudais", img: "Sheikh_Abdul_Rahman_Al-Sudais_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHfNQ54UPl7tCW4JidJHXWSi&si=8b13hBZMSSZCPu4I" },
  { name: "Sheikh Saud Al-Shuraim", img: "Sheikh_Saud_Al-Shuraim_Medium.jpeg", url: "https://youtube.com/playlist?list=PLzX-2km3_XsTt50tYP0s67dA_kipr35O_&si=qXS3resYEOJrz4PQ" },
  { name: "Sheikh Mishary Rashid Alafasy", img: "Sheikh_Mishary_Rashid_Alafasy_Medium.jpeg", url: "https://youtube.com/playlist?list=PLoqNzfHlA__knCeUoKUHjQfZpUL6mj64w&si=Kgk_r4xJcV6k9ozN" },
  { name: "Sheikh Maher Al-Muaiqly", img: "Sheikh_Maher_Al-Muaiqly_Medium.jpeg", url: "https://youtube.com/playlist?list=PLvc14zohWxi3ZExdtXD8-qNboMeAHitDl&si=ThusNbeda-4NOgsl" },
  { name: "Sheikh Mahmoud Khalil Al-Husary", img: "Sheikh_Mahmoud_Khalil_Al-Husary_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHfMFWX22VZWOKpzjr-vH_BM&si=IW0JVQlGA5feW6QF" },
  { name: "Sheikh Muhammad Siddiq Al-Minshawi", img: "Sheikh_Muhammad_Siddiq_Al-Minshawi_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHdUcO_uc-8F8J2NUQRDZjPG&si=U30wW181LG3SIHQU" },
  { name: "Sheikh Abdullah Ali Jaabir", img: "Sheikh_Abdullah_Ali_Jaabir_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHeyVWsP7AjsU1q3rPNTtjEg&si=BePlnRvGmje4-dSb" },
  { name: "Sheikh Ahmad Al-Ajmi", img: "Sheikh_Ahmad_Al-Ajmi_Medium.jpeg", url: "https://youtube.com/playlist?list=PLdJ-07gFPxVWJbNJ2W-cOG59XLD0G2ymw&si=Qb8QC3QMoTFfVhOQ" },
  { name: "Sheikh Ali Al-Hudhaify", img: "Sheikh_Ali_Al-Hudhaify_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHfQHVYUIo71_zou6U-v7SDf&si=Gr5f0bHZnppqRhZg" },
  { name: "Sheikh Muhammad Jibril", img: "Sheikh_Muhammad_Jibril_Medium.jpeg", url: "https://youtube.com/playlist?list=PL6TlMIZ5ylgqM4Uuu7iAhIeuSdF0v9yxo&si=nZ0Xv4n7-MVfkffD" },
  { name: "Sheikh Saad Al-Ghamdi", img: "Sheikh_Saad_Al-Ghamdi_Medium.jpeg", url: "https://youtube.com/playlist?list=PLFBCB5C33480F350C&si=Y9CTvc6jUcx1dbQZ" },
  { name: "Sheikh Yasser Al-Dossary", img: "Sheikh_Yasser_Al-Dossary_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHeD3wJTi-hmORqsCd7npmmS&si=2w8z86cD9f4njREB" },
  { name: "Sheikh Mustafa Ismail", img: "Sheikh_Mustafa_Ismail_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHdZs_nLdKex3cH7DOzD0ur5&si=pcv2_Q_DFzIi8LhD" },
  { name: "Sheikh Nasser Al-Qatami", img: "Sheikh_Nasser_Al-Qatami_Medium.jpeg", url: "https://youtube.com/playlist?list=PL4XkgOp0g5P5zR4u32MnSiwUTW3sJz6JZ&si=a99hpVNI3PJCjznX" },
  { name: "Sheikh Adil Al-Kalbani", img: "Sheikh_Adil_Al-Kalbani_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHd8ZxtylDs_Vkui8yb3ENiR&si=J0IvZOLiN9FQlRkG" },
  { name: "Sheikh Ibrahim Al-Akhdar", img: "Sheikh_Ibrahim_Al-Akhdar_Medium.jpeg", url: "https://youtube.com/playlist?list=PLtQwHtAVsvt961VdXtLPZAEp1GDjGl1-c&si=rZtr--Y7Jqa6qEn9" },
  { name: "Sheikh Abdulaziz Al-Zahrani", img: "Sheikh_Abdulaziz_Al-Zahrani_Medium.jpeg", url: "https://youtube.com/playlist?list=PLjTO2XV92TwDxDSUh1TZnvnIYXmfH-XLS&si=e2zCgXCefDPMau8u" },
  { name: "Sheikh Salah Al-Budair", img: "Sheikh_Salah_Al-Budair_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHdDUs_lDhb1t4g2OYd74yqB&si=vxDmECXWv7mDkUC-" },
  { name: "Sheikh Khaled Al-Qahtani", img: "Sheikh_Khaled_Al-Qahtani_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHcSPSv-5rg4IXSRo_IDxpu_&si=X7YPzOn9pJpEKFXh" },
  { name: "Sheikh Abdul Aziz Al-Ahmad", img: "Sheikh_Abdul_Aziz_Al-Ahmad_Medium.jpeg", url: "https://youtube.com/playlist?list=PLjTO2XV92TwAqVvyLaoGJDcFMkINgqcI_&si=Pb1oWuqA_2isCYSZ" },
  { name: "Sheikh Raad Muhammad Al Kurdi", img: "Sheikh_Raad_Muhammad_Al_kurdi_Medium.jpeg", url: "https://youtube.com/playlist?list=PL7uDa-H3hMohyKjencGxGeiXJWa62bntt&si=Aeqj6DlkdgCIm7i8" },
  { name: "Sheikh Salah Al-Hashimi", img: "Sheikh_Salah_Al-Hashimi_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHdzgKJt7o2G_8dwRIAvN7IA&si=KT6pi7ABzMLapVZC" },
  { name: "Sheikh Abu Bakr Ash-Shatri", img: "Sheikh_Abu_Bakr_Ash-Shatri_Medium.jpeg", url: "https://youtube.com/playlist?list=PL0wE3jIqC9kYeop0NgLGWlan-uO-n4FlQ&si=kMPQd5t9e5FkH-JA" },
  { name: "Sheikh Abdul Bari Al-Thubaity", img: "Sheikh_Abdul_Bari_Al-Thubaity_Medium.jpeg", url: "https://youtube.com/playlist?list=PLjTO2XV92TwDX5cVzqpS0u5ojONOSlaoS&si=QP_F5mTdG2nvpGz_" },
  { name: "Sheikh Ahmed Taleb Hameed", img: "Sheikh_Ahmed_Taleb_Hameed_Medium.jpeg", url: "https://youtube.com/playlist?list=PLzX-2km3_XsQr3-p2dKPYjpqL52yVpdA2&si=LQTpYYh3zRitkQUz" },
  { name: "Sheikh Muhammad Al Luhaidan", img: "Sheikh_Muhammad_Al_Luhaidan_Medium.jpeg", url: "https://youtube.com/playlist?list=PLxpAkjlGauHfKAYuQLRNAZomoezhfhRZe&si=DrzpAjkiYacDMmtp" },
];

export const metadata = {
  title: "Quran Reciters",
  description: "Listen to Quran recitations from renowned reciters",
};

export default function RecitersPage() {
  return (
    <>
      <ContentHeader
        title="Quran Reciters" breadcrumbs={[{ label: "Quran", href: "/quran" }, { label: "Study", href: "/quran/study" }, { label: "Reciters" }]}
        subtitle="Listen to Quran recitations from various reciters"
      />

      <section className="w-[92%] max-w-7xl mx-auto my-8 fade-in-up">
        <div className="bg-teal-100 rounded-2xl px-8 py-10 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <p className="font-[family-name:var(--font-amiri)] text-teal-900 text-[22px] leading-[1.6]">
            Listen to beautiful recitations of the Quran from renowned
            reciters around the world. Each reciter links to their full
            YouTube playlist.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-10 pb-32 md:pb-36 fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {reciters.map((reciter) => (
            <a
              key={reciter.name}
              href={reciter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="relative aspect-square bg-teal-50 overflow-hidden">
                <Image
                  src={`${STORAGE_URL}/${reciter.img}`}
                  alt={reciter.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-teal-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">Listen</span>
                </div>
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-teal-900 text-xs leading-tight group-hover:text-teal-700 transition-colors duration-200">
                  {reciter.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
