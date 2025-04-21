import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { DevelopmentView } from "@/components/development/development-view"

export const metadata: Metadata = {
  title: "Development | Team-Centered Task Management",
  description: "Track learning resources, skills development, and career growth",
}

export default function DevelopmentPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Development" description="Track learning resources, skills development, and career growth" />
      <div className="p-4">
        <DevelopmentView />
      </div>
    </div>
  )
}
