
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] border hover:shadow-[0_8px_16px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-orange-400 to-orange-600 text-primary-foreground border-orange-700 shadow-[0_6px_12px_rgba(194,65,12,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_16px_rgba(194,65,12,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)]",
        destructive:
          "bg-gradient-to-b from-red-400 to-red-600 text-destructive-foreground border-red-700 shadow-[0_6px_12px_rgba(127,29,29,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_16px_rgba(127,29,29,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)]",
        outline:
          "bg-gradient-to-b from-white to-gray-50 border-gray-300 shadow-[0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)]",
        secondary:
          "bg-gradient-to-b from-gray-200 to-gray-300 text-secondary-foreground border-gray-400 shadow-[0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15),0_3px_6px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.7)]",
        ghost: "bg-gradient-to-b from-transparent to-gray-50/50 border-transparent shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-gradient-to-b hover:from-gray-50 hover:to-gray-100 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]",
        link: "text-primary underline-offset-4 hover:underline shadow-none border-none hover:shadow-none active:shadow-none hover:scale-100 active:scale-100",
        signature: "bg-gradient-to-b from-[hsl(var(--signature-blue))] to-[hsl(var(--signature-blue-dark))] text-white border-[hsl(var(--signature-blue-dark))] shadow-[0_6px_12px_rgba(11,61,145,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_16px_rgba(11,61,145,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8),0_0_4px_rgba(255,255,255,0.3)]",
        yes: "bg-gradient-to-b from-green-500 to-green-700 text-white border-green-800 shadow-[0_6px_12px_rgba(0,0,0,0.3),0_3px_6px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.05] active:scale-[0.98] text-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]",
        no: "bg-gradient-to-b from-red-500 to-red-700 text-yellow-400 border-red-800 shadow-[0_6px_12px_rgba(0,0,0,0.3),0_3px_6px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.05] active:scale-[0.98] text-shadow-[1px_1px_2px_rgba(0,0,0,0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
