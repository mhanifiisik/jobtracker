import { cn } from "@/utils/cn"
import type { ReactNode } from "react"

interface BadgeProps{
    children:ReactNode
    className?:string
}

export const Badge = ({ children, ...props }: BadgeProps) => {
  return <div className={cn("rounded-md px-2 py-1 text-xs font-medium", props.className)} {...props}>{children}</div>
}
