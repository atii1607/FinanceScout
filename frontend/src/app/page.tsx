import Link from "next/link";
import { ArrowRight, BadgeCheck, Landmark, LineChart, Lock, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Ana sayfa: degrade zeminin koyu tarafında okunabilirlik için açık tipografi */
export default function HomePage() {
  return (
    <div className="overflow-hidden pb-24 text-white">
      <section className="relative mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-14">
        <div className="pointer-events-none absolute inset-x-5 top-3 hidden h-px bg-white/18 lg:block" />
        <div className="pointer-events-none absolute bottom-0 right-8 top-0 hidden w-px bg-white/14 xl:block" />

        <div className="grid min-h-[520px] items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] xl:gap-16">
          <div className="relative border-l-[4px] border-white/45 pl-6 md:pl-9">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-sky-100 drop-shadow-sm">
              Kurumsal finansal görünürlük
            </p>
            <h1 className="font-heading mt-5 max-w-[760px] text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)] md:text-6xl lg:text-[4.75rem]">
              Finansal kararlarınız için net ve güvenilir analiz alanı
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-white/90 drop-shadow-sm md:text-xl">
              Geçmiş fiyat davranışını, performans özetlerini ve temel risk sinyallerini sade bir banka arayüzü
              düzeninde görün. Sonuçlar yatırım tavsiyesi değil, karar öncesi bilgilendirme katmanıdır.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/analiz"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-[15px] shadow-xl shadow-black/30")}
              >
                Analiz merkezine git
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/guvenlik"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-white/55 bg-white/8 px-6 text-[15px] font-semibold text-white shadow-lg shadow-black/10 hover:bg-white/16 hover:text-white",
                )}
              >
                Güven yaklaşımımız
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/18 border-y border-white/22 py-5">
              {[
                ["12", "sayfa yapı"],
                ["3", "temel metrik"],
                ["0", "karmaşa"],
              ].map(([value, label]) => (
                <div key={label} className="px-4 first:pl-0">
                  <p className="font-heading text-3xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/68">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative border-y border-white/22 py-8 lg:border-l lg:border-y-0 lg:py-12 lg:pl-10">
            <div className="absolute -right-20 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl lg:block" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/68">FinanceScout özeti</p>
            <div className="relative mt-8 space-y-8">
              {[
                {
                  icon: Lock,
                  t: "Şeffaf işlem",
                  d: "Veri kaynağı ve model çıktıları erişilebilir şekilde sunulur.",
                },
                {
                  icon: Landmark,
                  t: "Kurumsal düzen",
                  d: "Tutarlı dil, geniş nefes alanları ve banka sitesi yalınlığı.",
                },
                {
                  icon: BadgeCheck,
                  t: "Okunabilir özet",
                  d: "RMSE ve oynaklık gibi metrikler hızlı taranabilir biçimde verilir.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="group grid grid-cols-[48px_1fr] gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-white shadow-lg shadow-black/10 transition-colors group-hover:bg-white/16">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="border-b border-white/14 pb-8 group-last:border-b-0 group-last:pb-0">
                    <p className="text-lg font-bold text-white">{t}</p>
                    <p className="mt-2 max-w-sm text-[15px] leading-7 text-white/78">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 border-y border-white/22 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">Banka sitesi disiplini</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
              Az kart, daha net akış
            </h2>
          </div>
          <p className="text-lg font-medium leading-8 text-white/82">
            Tasarım; vitrin, hizmet satırı ve çağrı alanı olarak üç net parçaya ayrıldı. Böylece sayfa sağ-sol boşluğu
            kullanır, ancak arayüz gereksiz kutularla kalabalıklaşmaz.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-18 max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-14">
          <div className="lg:pt-3">
            <h2 className="font-heading text-4xl font-semibold tracking-[-0.025em] text-white md:text-5xl">
              Temel hizmetler
            </h2>
            <p className="mt-5 text-[16px] font-medium leading-8 text-white/80">
              Odaklandığımız çözümler, tek satırlık kurumsal servis yapısı ile sunulur.
            </p>
          </div>

          <ul className="divide-y divide-white/18 border-y border-white/24">
            {[
              {
                icon: LineChart,
                title: "Piyasa analizi",
                body: "Günlük kapanış serilerinden tahmini çizgi ve üst / alt bant görünümü.",
                href: "/analiz",
                action: "Araca git",
              },
              {
                icon: BadgeCheck,
                title: "Performans özeti",
                body: "Geçmişe dönük test ile sapma göstergelerine genel bakış.",
                href: "/hizmetler",
                action: "Hizmetleri incele",
              },
              {
                icon: ShieldCheck,
                title: "Veri güvenliği",
                body: "Kontrollü demo yapısı ve iz sürmesi kolay bağlantı modeli.",
                href: "/guvenlik",
                action: "Güvenlik sayfası",
              },
            ].map(({ icon: Icon, title, body, href, action }) => (
              <li
                key={title}
                className="grid gap-5 py-9 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center md:gap-7"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-sky-100 ring-1 ring-white/18">
                  <Icon className="size-6" aria-hidden />
                </span>
                <div>
                  <h3 className="font-heading text-2xl font-semibold tracking-[-0.015em] text-white">{title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] font-medium leading-7 text-white/78">{body}</p>
                </div>
                <Link
                  href={href}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "h-auto justify-start p-0 text-[15px] font-bold text-white underline decoration-white/45 underline-offset-4 hover:text-white hover:decoration-white md:justify-end",
                  )}
                >
                  {action} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 md:px-8">
        <div className="grid gap-8 border-t border-white/24 pt-14 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">Sonraki adım</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
              Hazır olduğunuzda analize başlayın
            </h2>
            <p className="mt-4 text-[16px] font-medium leading-8 text-white/80">
              Yardımcı sembol listesi ile dakikalar içinde grafik ve özet. Sonuçlar yatırım tavsiyesi içermez.
            </p>
          </div>
          <Link
            href="/analiz"
            className={cn(buttonVariants({ size: "lg" }), "h-12 w-full shrink-0 px-7 shadow-xl shadow-black/25 md:w-auto")}
          >
            Analizi aç
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
