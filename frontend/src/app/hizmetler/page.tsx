import Link from "next/link";
import { ArrowRight, BarChart3, Binary, ShieldCheck, Zap, Globe, PieChart } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Hizmetler · FinanceScout",
};

export default function HizmetlerPage() {
  return (
    <div className="overflow-hidden pb-24 text-white">
      {/* Header Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 md:px-10 md:pt-20">
        <div className="max-w-3xl">
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-sky-100 flex items-center gap-2">
            <Zap className="size-4" />
            Hizmetlerimiz
          </p>
          <h1 className="font-heading mt-6 text-5xl font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-6xl lg:text-7xl">
            Finansal Analizde <br /> Yeni Standartlar
          </h1>
          <p className="mt-8 text-lg font-medium leading-relaxed text-white/80 md:text-xl md:leading-9">
            Karmaşık verileri, yapay zeka destekli modellerle anlaşılır ve aksiyon alınabilir özetlere dönüştürüyoruz. 
            Yatırım stratejinizi destekleyen üç temel sütun üzerine inşa edilen hizmetlerimizi keşfedin.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Piyasa Tahmini",
              desc: "100.000+ varlık üzerinde Prophet tabanlı zaman serisi analizi ile kısa ufuklu fiyat beklentilerini ve güven aralıklarını görün.",
              color: "bg-blue-500/20 text-blue-300"
            },
            {
              icon: Binary,
              title: "Geçmişe Dönük Test",
              desc: "Sistemi dürüstçe test edin. Seçtiğiniz sürenin son %20'sini yapay zekadan saklarız ve hiç bilmediği bu dönemde ne kadar başarılı tahmin yaptığını size dürüstçe raporlarız.",
              color: "bg-purple-500/20 text-purple-300"
            },
            {
              icon: PieChart,
              title: "Risk Profilleme",
              desc: "Varlık bazlı günlük ve yıllıklaştırılmış oynaklık metrikleri ile portföyünüzün maruz kaldığı risk seviyesini etiketleyin.",
              color: "bg-emerald-500/20 text-emerald-300"
            }
          ].map((item) => (
            <div key={item.title} className="group relative rounded-3xl border border-white/12 bg-white/5 p-8 transition-all hover:bg-white/10">
              <div className={cn("flex size-14 items-center justify-center rounded-2xl ring-1 ring-white/10", item.color)}>
                <item.icon className="size-7" />
              </div>
              <h3 className="mt-8 text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Features */}
      <section className="mx-auto mt-32 max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Neden FinanceScout?
              </h2>
              <p className="mt-6 text-lg text-white/70">
                Geleneksel analiz araçlarının aksine, biz hıza ve doğruluğa odaklanıyoruz. 
                Platformumuz, finansal teknoloji dünyasının en sağlam temellerini bir araya getirir.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                {
                  icon: Globe,
                  t: "Global Veri Erişimi",
                  d: "Yahoo Finance entegrasyonu ile tüm dünya borsaları parmaklarınızın ucunda."
                },
                {
                  icon: ShieldCheck,
                  t: "Şeffaf Metodoloji",
                  d: "Kara kutu modeller yerine, her tahminin hata payını ve geçmiş performansını gösteriyoruz."
                }
              ].map((f) => (
                <div key={f.t} className="flex gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                    <f.icon className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{f.t}</h4>
                    <p className="mt-2 text-white/60 leading-relaxed">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-3xl border border-white/12 bg-white/5 p-6 md:p-8">
             <div className="flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                   <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-rose-500/50" />
                      <div className="size-2.5 rounded-full bg-amber-500/50" />
                      <div className="size-2.5 rounded-full bg-emerald-500/50" />
                   </div>
                   <div className="h-4 w-24 rounded-full bg-white/10" />
                </div>
                
                {/* Mockup Content */}
                <div className="relative flex-1 px-6 pt-4">
                   <div className="space-y-1">
                      <div className="h-3 w-16 rounded bg-sky-400/30" />
                      <div className="h-8 w-32 rounded bg-white/10" />
                   </div>
                   
                   {/* Overlapping Line Chart Mockup - History vs Future Prediction */}
                   <div className="relative mt-10 h-48 w-full px-4">
                      <svg className="h-full w-full overflow-visible" viewBox="0 0 400 150">
                         {/* Bugun (Today) Indicator */}
                         <line x1="240" y1="0" x2="240" y2="150" stroke="white" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
                         <text x="245" y="15" fill="white" fontSize="9" className="font-bold opacity-40 uppercase">Bugün</text>

                         {/* HISTORY SEGMENT (0 to 240) */}
                         
                         {/* History: AI Tahmini (Blue Glow) */}
                         <path 
                            d="M0,120 Q40,100 80,110 T160,80 T240,95" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="text-sky-400 opacity-60"
                         />

                         {/* History: Gerçek Fiyat (White) */}
                         <path 
                            d="M0,122 Q40,98 80,113 T160,78 T240,93" 
                            fill="none" 
                            stroke="white" 
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="opacity-90"
                         />

                         {/* FUTURE SEGMENT (240 to 400) */}
                         
                         {/* Future: Gelecek Tahmini (GOLD / AMBER) */}
                         <path 
                            d="M240,93 Q320,60 400,70" 
                            fill="none" 
                            stroke="#fbbf24" 
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray="8 4"
                            className="drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                         />
                         <circle cx="240" cy="93" r="4" fill="white" className="shadow-[0_0_10px_white]" />
                         <circle cx="400" cy="70" r="4" fill="#fbbf24" className="animate-pulse shadow-[0_0_15px_rgba(251,191,36,1)]" />

                         {/* Labels on SVG */}
                         <text x="10" y="145" fill="white" fontSize="9" className="font-bold opacity-30 uppercase">Geçmiş Veri</text>
                         <text x="260" y="145" fill="#fbbf24" fontSize="9" className="font-bold opacity-70 uppercase tracking-widest">Gelecek Öngörüsü</text>
                      </svg>
                      
                      {/* Legend */}
                      <div className="mt-10 flex justify-center gap-6 border-t border-white/5 pt-4">
                         <div className="flex items-center gap-2">
                            <div className="h-0.5 w-3 bg-white" />
                            <span className="text-[9px] font-bold text-white/50 uppercase">GERÇEK</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="h-0.5 w-3 bg-sky-400" />
                            <span className="text-[9px] font-bold text-sky-400/70 uppercase">TEST</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="h-0.5 w-3 bg-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,1)]" />
                            <span className="text-[9px] font-bold text-[#fbbf24] uppercase underline underline-offset-4 decoration-[#fbbf24]/30">TAHMİN</span>
                         </div>
                      </div>

                      {/* Accuracy Badge - Top Right repositioned */}
                      <div className="absolute top-0 right-0">
                         <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400 shadow-lg backdrop-blur-md">
                            GÜVEN ARALIĞI: %95
                         </div>
                      </div>
                   </div>
                </div>

                {/* Mockup Footer */}
                <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-white/5 p-4">
                   {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-2 w-10 rounded-full bg-white/10" />
                   ))}
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -bottom-4 -left-4 size-24 rounded-full bg-sky-500/10 blur-3xl" />
             <div className="absolute -right-4 -top-4 size-32 rounded-full bg-purple-500/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mt-32 max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-[40px] border border-white/20 bg-white/5 px-8 py-16 text-center md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="font-heading text-4xl font-semibold text-white md:text-6xl">
              Analize Bugün Başlayın
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-white/70 md:text-xl">
              Karmaşık finansal tablolarla vakit kaybetmeyin. İhtiyacınız olan tüm özetler tek bir tık uzağınızda.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/analiz"
                className={cn(buttonVariants({ variant: "brand", size: "lg" }), "h-14 px-10 w-full sm:w-auto")}
              >
                Analiz Aracını Aç
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <Link
                href="/iletisim"
                className={cn(buttonVariants({ variant: "glass", size: "lg" }), "h-14 px-10 w-full sm:w-auto")}
              >
                Destek Al
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
