"use client";

import { ChevronDown, Compass, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/site/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Gezinme",
    icon: Compass,
    links: [
      { href: "/", label: "Ana sayfa" },
      { href: "/hizmetler", label: "Hizmetler" },
      { href: "/guvenlik", label: "Güvenlik" },
      { href: "/analiz", label: "Analiz merkezi" },
    ],
  },
  {
    title: "Kurumsal",
    icon: Layers,
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/yardim", label: "Yardım merkezi" },
      { href: "/yasal/gizlilik", label: "Gizlilik bildirimi" },
      { href: "/yasal/kvkk", label: "KVKK aydınlatma" },
    ],
  },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = shellRef.current;
      if (el && !el.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[120] px-5 pt-4 md:px-8 md:pt-5">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Sol: logo + kelime + dropdown */}
        <div ref={shellRef} className="relative flex min-w-0 shrink-0 items-center">
          <button
            type="button"
            className="border-[var(--nav-border)] bg-[var(--nav-surface)] hover:bg-[var(--nav-trigger-hover)] flex items-center gap-2 rounded-2xl border px-2 py-2 pr-3 shadow-[var(--nav-shadow)] backdrop-blur-xl transition-colors duration-300 ease-out"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-controls="site-nav-command"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <LogoMark className="size-10 shrink-0 shadow-md sm:size-11" />
            <span className="font-heading text-[var(--nav-fg)] hidden text-[15px] font-semibold tracking-tight sm:inline md:text-base">
              FinanceScout
            </span>
            <ChevronDown
              className={cn(
                "text-[var(--nav-muted)] size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                menuOpen ? "rotate-180" : "rotate-0",
              )}
              aria-hidden
            />
          </button>

          <div
            id="site-nav-command"
            role="dialog"
            aria-label="Site menüsü"
            aria-hidden={!menuOpen}
            className={cn(
              "border-[var(--panel-border)] bg-[var(--panel-bg)] absolute left-0 top-[calc(100%+12px)] z-[130] w-[min(calc(100vw-2rem),440px)] origin-top-left rounded-[24px] border p-5 shadow-[var(--panel-shadow)] backdrop-blur-xl motion-safe:transition-[opacity,transform,filter] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[min(92vw,480px)] md:w-[520px]",
              menuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100 blur-0"
                : "pointer-events-none translate-y-2 scale-[0.96] opacity-0 blur-[2px]",
            )}
          >
            <p className="text-[var(--panel-muted)] text-[11px] font-semibold uppercase tracking-[0.18em]">
              Sayfalar
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[var(--panel-muted)] mb-3 flex items-center gap-2">
                    <group.icon className="size-4 opacity-80" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em]">{group.title}</span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {group.links.map((link) => {
                      const active =
                        link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);
                      const emphasized = link.href === "/analiz";
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "focus-visible:ring-ring block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
                              emphasized
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : active
                                  ? "bg-[var(--panel-active-bg)] text-[var(--panel-active-fg)]"
                                  : "text-[var(--panel-link)] hover:bg-[var(--panel-row-hover)]",
                            )}
                            onClick={() => setMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-[var(--panel-muted)] border-border/60 mt-5 border-t pt-4 text-xs leading-relaxed">
              Menüyü kapatmak için dışarı tıklayın veya Esc tuşuna basın.
            </p>
          </div>
        </div>

        {/* Sağ: ana aksiyon */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/analiz"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-xl px-5 py-2.5 text-[13px] font-semibold shadow-md md:text-sm",
            )}
          >
            Analiz
          </Link>
        </div>
      </div>
    </header>
  );
}
