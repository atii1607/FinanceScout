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
      <PageHeader 
        title={title} 
        description={description} 
        className="text-left text-white [&_h1]:text-white [&_p]:text-zinc-400 font-medium" 
      />
      <div className={cn("mx-auto w-full max-w-3xl px-4 pb-24 text-lg", className)}>
        <article className="text-zinc-400 space-y-6 pt-2 text-[15px] leading-relaxed text-lg w-full 
          [&_h2]:text-white [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:first:mt-0 
          [&_h3]:text-white [&_h3]:font-heading [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold
          [&_ul]:mt-2 [&_ul]:space-y-2 [&_ul]:pl-4 [&_ul]:list-disc [&_ul]:text-zinc-400
          [&_section]:space-y-3 
          [&_strong]:text-white [&_strong]:font-semibold"
        >
          {children}
        </article>
      </div>
    </>
  );
}