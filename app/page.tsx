import type { Metadata } from "next"
import { TeamWorkloadCard } from "@/components/dashboard/team-workload-card"
import { MyTasksCard } from "@/components/dashboard/my-tasks-card"
import { SkillsOverviewCard } from "@/components/dashboard/skills-overview-card"
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DevelopmentGoalsCard } from "@/components/dashboard/development-goals-card"

export const metadata: Metadata = {
  title: "Dashboard | Team-Centered Task Management",
  description: "Overview of your tasks, team workload, and development goals",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyTasksCard />
        </div>
        <div className="lg:col-span-1">
          <SkillsOverviewCard />
        </div>
        <div className="lg:col-span-2">
          <TeamWorkloadCard />
        </div>
        <div className="lg:col-span-1">
          <DevelopmentGoalsCard />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityCard />
        </div>
      </div>
    </div>
  )
}
