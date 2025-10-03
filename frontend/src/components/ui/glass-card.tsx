import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
}

type GlassCardHeaderProps = React.HTMLAttributes<HTMLDivElement>
type GlassCardTitleProps = React.HTMLAttributes<HTMLHeadingElement>
type GlassCardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
type GlassCardContentProps = React.HTMLAttributes<HTMLDivElement>

function GlassCard({ className, gradient = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/20 bg-white/5 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300",
        gradient && "bg-gradient-to-br from-white/10 to-white/2",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{props.children}</div>
    </div>
  )
}

function GlassCardHeader({ className, ...props }: GlassCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 rounded-t-2xl pb-4 border-b border-white/10",
        className
      )}
      {...props}
    />
  )
}

function GlassCardTitle({ className, ...props }: GlassCardTitleProps) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function GlassCardDescription({ className, ...props }: GlassCardDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function GlassCardContent({ className, ...props }: GlassCardContentProps) {
  return (
    <div
      className={cn(
        "pt-4",
        className
      )}
      {...props}
    />
  )
}

export {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
}