import type { ReactNode } from "react";

import { PageHeader } from "@/components/site/page-header";
import { cn } from "@/lib/utils";

export function SimpleArticle({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className={cn("mx-auto w-full max-w-3xl px-4 pb-24", className)}>
        <article className="text-muted-foreground [&_h2]:text-heading space-y-6 pt-2 text-[15px] leading-relaxed [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:first:mt-0 [&_ul]:mt-2 [&_ul]:space-y-2 [&_section]:space-y-3">
          {children}
        </article>
      </div>
    </>
  );
}
