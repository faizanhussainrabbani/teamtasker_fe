"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/context/auth-context"

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, isLoading, router])

  const showSidebar = mounted && isAuthenticated

  return (
    <div className="flex min-h-screen">
      {showSidebar ? <AppSidebar /> : null}
      <main className={`${showSidebar ? "flex-1" : "w-full"} overflow-x-hidden`}>{children}</main>
    </div>
  )
}
