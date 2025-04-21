import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { CommunicationView } from "@/components/communication/communication-view"

export const metadata: Metadata = {
  title: "Communication | Team-Centered Task Management",
  description: "Team communication, messages, and collaboration tools",
}

export default function CommunicationPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Communication" description="Team communication, messages, and collaboration tools" />
      <div className="p-4">
        <CommunicationView />
      </div>
    </div>
  )
}
