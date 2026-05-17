import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="FinanceScout Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
        priority
      />
    </div>
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
