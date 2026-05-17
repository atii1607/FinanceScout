import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_4px_14px_0_oklch(var(--primary)/0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] btn-shine",
        brand:
          "bg-white text-primary shadow-xl hover:bg-sky-50 hover:text-primary/80",
        glass:
          "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]",
        neon:
          "border-sky-400/30 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20 hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]",
        outline:
          "border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-white/70 hover:bg-white/10 hover:text-white",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-white underline-offset-4 hover:text-sky-300 hover:underline",
      },
      size: {
        default: "h-10 px-5 gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-8 px-4 text-xs gap-1.5",
        lg: "h-12 px-8 text-base gap-2.5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
