import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-tight shadow-md",
        className,
      )}
      aria-hidden
    >
      FS
    </span>
  );
}

export function BrandLogo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 outline-none transition-opacity hover:opacity-90", className)}
    >
      <LogoMark className="rounded-xl shadow-sm" />
      <span className="flex flex-col leading-tight">
        <span className="text-foreground font-sans text-base font-semibold tracking-tight">FinanceScout</span>
        {showTagline ? (
          <span className="text-muted-foreground text-[11px] font-normal tracking-wide">Dijital finans özeti</span>
        ) : null}
      </span>
    </Link>
  );
}
