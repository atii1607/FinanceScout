import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto w-full max-w-6xl px-4 pt-10 pb-8 md:pt-14 md:pb-10", className)}>
      <h1 className="font-heading text-heading text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground mt-4 max-w-3xl text-[15px] leading-relaxed md:text-base">{description}</p>
      ) : null}
    </header>
  );
}
