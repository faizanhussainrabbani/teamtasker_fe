import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { TasksView } from "@/components/tasks/tasks-view"

export const metadata: Metadata = {
  title: "Tasks | Team-Centered Task Management",
  description: "Manage and track your team's tasks and projects",
}

export default function TasksPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Tasks" description="Manage and track your team's tasks and projects" />
      <div className="p-4">
        <TasksView />
      </div>
    </div>
  )
}
