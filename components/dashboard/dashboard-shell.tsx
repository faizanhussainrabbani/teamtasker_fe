"use client"

import { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
}

/**
 * A layout component for dashboard pages that provides consistent padding and structure
 */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-6 w-full">
        {children}
      </div>
    </div>
  )
}
