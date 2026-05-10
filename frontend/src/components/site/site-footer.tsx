import Link from "next/link";

const FOOTER_COL = [
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/hizmetler", label: "Hizmetler" },
      { href: "/iletisim", label: "İletişim" },
    ],
  },
  {
    title: "Güvenlik ve yasal",
    links: [
      { href: "/guvenlik", label: "Güvenlik" },
      { href: "/yasal/gizlilik", label: "Gizlilik bildirimi" },
      { href: "/yasal/kvkk", label: "KVKK aydınlatma" },
    ],
  },
  {
    title: "Araçlar",
    links: [
      { href: "/analiz", label: "Analiz merkezi" },
      { href: "/yardim", label: "Yardım merkezi" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--footer-bg)] text-[var(--footer-fg)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <p className="font-heading text-lg font-semibold tracking-tight">FinanceScout</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--footer-muted)]">
            Veriye dayalı özetler sunan dijital bir analiz deneyimi. Şeffaf süreçler ve güven odaklı iletişim ile yanınızdayız.
          </p>
        </div>
        {FOOTER_COL.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--footer-fg)]">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--footer-muted)] transition-colors hover:text-[var(--footer-fg)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs leading-relaxed text-[var(--footer-muted)] md:text-left">
          <p>
            FinanceScout bir öğrenme ve demo platformudur; burada sunulan tahmin ve metrikler{" "}
            <strong className="font-medium text-[var(--footer-fg)]">yatırım tavsiyesi değildir</strong>. Gerçek yatırım
            kararlarınız için yetkili kurumlara başvurun.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} FinanceScout. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
