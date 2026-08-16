import * as React from "react"

import { cn } from "@app/lib/utils"

type FieldGroupProps = React.ComponentProps<"section"> & {
  title: React.ReactNode
  titleAction?: React.ReactNode
  contentClassName?: string
}

export function FieldGroup({
  title,
  titleAction,
  contentClassName,
  className,
  children,
  ...props
}: FieldGroupProps) {
  return (
    <section
      className={cn(
        "card-frame bg-card p-5 text-sm text-card-foreground",
        className
      )}
      {...props}
    >
      <header className="mb-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-base leading-snug font-medium">
            {title}
          </h3>
          {titleAction}
        </div>
        <span className="mt-2 block h-1 w-14 rounded-full bg-red-400" />
      </header>
      <div className={cn(contentClassName)}>{children}</div>
    </section>
  )
}
