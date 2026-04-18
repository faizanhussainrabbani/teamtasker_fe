import type React from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function DevelopmentLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
