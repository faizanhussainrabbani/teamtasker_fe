import type { Metadata } from "next"
import { TeamOverview } from "@/components/team/team-overview"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Team Overview | Team-Centered Task Management",
  description: "View your team's workload, skills, and task distribution",
}

export default function TeamPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Team Overview" description="View your team's workload, skills, and task distribution" />
      <div className="p-4">
        <TeamOverview />
      </div>
    </div>
  )
}
