import * as React from "react"

// Shared demo containers: a centered column of controls, or a wrapping row.
export const Stack = ({
  children,
  loose,
}: {
  children: React.ReactNode
  loose?: boolean
}) => (
  <div className={`flex w-full max-w-sm flex-col ${loose ? "gap-8" : "gap-4"}`}>
    {children}
  </div>
)

export const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {children}
  </div>
)
