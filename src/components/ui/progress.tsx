import * as React from "react"
import { cn } from "@/utils/cn"

interface ProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: number
  color?: string
}

const Progress = ({ className, value, color, ...props }: ProgressProps) => {
  const getColorClass = () => {
    switch (color) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-primary"
    }
  }

  return (
    <div
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", getColorClass())}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
}

export { Progress }

