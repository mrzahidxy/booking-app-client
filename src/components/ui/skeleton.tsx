import { cn } from "@/shared/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-muted/80", className)}
      {...props}
    />
  )
}

export { Skeleton }
