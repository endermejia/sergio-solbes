import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2 active:scale-[0.99] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 active:bg-primary/95',
        primary:
          'bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 active:bg-primary/95',
        secondary:
          'bg-secondary text-secondary-foreground border border-border/70 shadow-2xs hover:bg-secondary/80 hover:text-foreground',
        accent:
          'bg-accent text-accent-foreground shadow-2xs hover:bg-accent/90 active:bg-accent/95',
        outline:
          'border border-border/80 bg-background text-foreground shadow-2xs hover:bg-secondary hover:text-foreground hover:border-border dark:bg-card/40 dark:hover:bg-secondary/70',
        'outline-accent':
          'border border-accent/40 bg-accent/5 text-accent shadow-2xs hover:bg-accent hover:text-accent-foreground',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-secondary/70',
        'ghost-accent':
          'text-accent hover:text-accent hover:bg-accent/10',
        destructive:
          'bg-destructive text-white shadow-2xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        link:
          'text-accent underline-offset-4 hover:underline hover:text-accent/80 p-0 h-auto font-medium',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 px-3 text-xs gap-1.5 has-[>svg]:px-2.5',
        lg: 'h-10 px-5 text-sm font-medium has-[>svg]:px-4',
        xl: 'h-11 px-6 text-base font-medium has-[>svg]:px-5',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
