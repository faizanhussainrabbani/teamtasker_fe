import type { Metadata } from "next"
import { TeamOverview } from "@/components/team/team-overview"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Team Management | Team-Centered Task Management",
  description: "View, create, update, and manage teams and member distribution",
}

export default function TeamPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Team Management"
        description="View, create, update, and manage teams with live workload context"
      />
      <div className="p-4">
        <TeamOverview />
      </div>
    </div>
  )
}
