import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/ui/api-state"

export const metadata: Metadata = {
  title: "Communication | Team-Centered Task Management",
  description: "Team communication, messages, and collaboration tools",
}

export default function CommunicationPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Communication" description="Team communication, messages, and collaboration tools" />
      <div className="p-4">
        <EmptyState
          title="Communication is temporarily unavailable"
          description="This page is disabled until backend communication and announcements APIs are implemented."
        />
      </div>
    </div>
  )
}
